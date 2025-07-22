import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { CommonModule } from '@angular/common';


@NgModule({

  imports: [
    AppComponent,
    LoginComponent,
    RoomListComponent,
    ChatRoomComponent,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    FormsModule,
    LoginComponent
  ],
  providers: []
})
export class AppModule { }