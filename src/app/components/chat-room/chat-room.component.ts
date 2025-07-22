import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../models/message';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  imports: [FormsModule, DatePipe, CommonModule],
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage = '';
  roomName = '';
  users: string[] = [];
  currentUser: string | null = null;
  isLoading = false;
  errorMessage = '';

  private messagesSub!: Subscription;
  private paramsSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.paramsSub = this.route.params.subscribe(params => {
      this.roomName = params['name'];
      this.joinRoom();
    });
  }

  joinRoom(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Clear previous messages
    this.messages = [];
    
    // Disconnect from any previous room
    this.chatService.leaveRoom();

    // Connect to new room
    if (this.roomName && this.currentUser) {
      this.chatService.joinRoom(this.roomName, this.currentUser);
      
      this.messagesSub = this.chatService.getMessages().subscribe({
        next: (data: any) => {
          if (data.type === 'user_list') {
            this.users = data.users;
          } else {
            const message: Message = {
              sender: data.sender,
              content: data.content,
              timestamp: new Date(data.timestamp),
              room: data.room
            };
            this.messages.push(message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Chat error:', error);
          this.errorMessage = 'Connection error. Trying to reconnect...';
          this.isLoading = false;
        }
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    
    try {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    } catch (error) {
      console.error('Error sending message:', error);
      this.errorMessage = 'Failed to send message';
    }
  }

  leaveRoom(): void {
    if (this.roomName && this.currentUser) {
      // Notify other users in the room
      const leaveMessage = `${this.currentUser} has left the room`;
      this.chatService.sendMessage(leaveMessage);
      
      // Small delay to ensure leave message is sent
      setTimeout(() => {
        this.chatService.leaveRoom();
        this.router.navigate(['/rooms']);
      }, 200);
    }
  }

  ngOnDestroy(): void {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
    this.leaveRoom();
  }
}