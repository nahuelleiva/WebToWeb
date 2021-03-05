import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { WebRtcService } from '../../providers//webrtc.service';
import { UserInfo } from '../../../models/peer-data';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Output() userSelected: EventEmitter<UserInfo> = new EventEmitter();

  public users$: Observable<Array<UserInfo>>;


  constructor(private rtcService: WebRtcService) { }

  ngOnInit() {
    this.users$ = this.rtcService.users$;
  }

  public userClicked(user: UserInfo) {
    this.userSelected.emit(user);
  }

}
