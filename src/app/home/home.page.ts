import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebRtcService } from '../providers/webrtc.service';
import { Subscription } from 'rxjs';
import { SignalrService } from '../providers/signalr.service';
import { UserInfo, PeerData, SignalInfo, ChatMessage } from '../../models/peer-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('me') me: ElementRef;

  public subscriptions = new Subscription();

  private stream;

  public complete = false;

  public streaming = false;

  public currentUser: string;

  public dataString: string;

  public userVideo: string;
  public userVideoName: string;

  public messages: Array<ChatMessage>;

  public mediaError = (): void => { console.error(`Can't get user media`); };

  constructor(private webRtcService: WebRtcService, private signalR: SignalrService) { }

  ngOnInit() {
    this.messages = new Array();

    this.subscriptions.add(this.signalR.newPeer$.subscribe((user: UserInfo) => {
      this.webRtcService.newUser(user);
      this.signalR.sayHello(this.currentUser, user.connectionId);
    }));

    this.subscriptions.add(this.signalR.helloAnswer$.subscribe((user: UserInfo) => {
      this.webRtcService.newUser(user);
    }));

    this.subscriptions.add(this.signalR.disconnectedPeer$.subscribe((user: UserInfo) => {
      this.webRtcService.disconnectedUser(user);
    }));

    this.subscriptions.add(this.signalR.signal$.subscribe((signalData: SignalInfo) => {
      this.webRtcService.signalPeer(signalData.user, signalData.signal, this.stream);
    }));

    this.subscriptions.add(this.webRtcService.onSignalToSend$.subscribe((data: PeerData) => {
      this.signalR.sendSignalToUser(data.data, data.id);
    }));

    this.subscriptions.add(this.webRtcService.onData$.subscribe((data: PeerData) => {
      this.messages = [...this.messages, { own: false, message: data.data }];
      console.log(`Data from user ${data.id}: ${data.data}`);
    }));

    this.subscriptions.add(this.webRtcService.onStream$.subscribe((data: PeerData) => {
      this.streaming = true;
      this.userVideo = data.id;
      this.userVideoName = this.webRtcService.getUser(data.id).userName;
      this.videoPlayer.nativeElement.srcObject = data.data;
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.play();

      setTimeout(() => {
        this.me.nativeElement.srcObject = this.stream;
        this.me.nativeElement.load();
        this.me.nativeElement.play();        
      }, 1000);
    }));
  }

  public onUserSelected(userInfo: UserInfo) {
    const peer = this.webRtcService.createPeer(this.stream, userInfo.connectionId, true);
    this.webRtcService.currentPeer = peer;
  }

  public async saveUsername(): Promise<void> {
    try {
      await this.signalR.startConnection(this.currentUser);
      this.complete = true;
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.videoPlayer.nativeElement.srcObject = this.stream;
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.play();
    } catch (error) {
      console.error(`Can't join room, error ${error}`);
    }
  }

  public sendMessage() {
    this.webRtcService.sendMessage(this.dataString);
    this.messages = [...this.messages, { own: true, message: this.dataString }];
    this.dataString = null;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
