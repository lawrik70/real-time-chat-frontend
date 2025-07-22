import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private websocketService: WebsocketService
  ) {}

  getRooms(): Observable<{rooms: string[]}> {
    return this.http.get<{rooms: string[]}>(`${this.apiUrl}/rooms`);
  }

  createRoom(roomName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms`, { name: roomName });
  }

  joinRoom(roomName: string, username: string): void {
    const wsUrl = `ws://localhost:8000/ws/${roomName}/${username}`;
    this.websocketService.connect(wsUrl);
  }

  sendMessage(content: string): void {
    this.websocketService.sendMessage(content);
  }

  getMessages(): Observable<Message> {
    return this.websocketService.getMessages();
  }

  leaveRoom(): void {
    this.websocketService.disconnect();
  }
}