import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'rooms', 
    component: RoomListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'room/:name', 
    component: ChatRoomComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '', 
    redirectTo: '/rooms', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/rooms' 
  }
];