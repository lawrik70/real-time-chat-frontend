import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit, OnDestroy {
  rooms: string[] = [];
  newRoomName = '';
  currentUser: string | null = null;
  isLoading = false;
  errorMessage = '';
  
  private userSubscription: Subscription | undefined;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user from auth service
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      
      // Redirect to login if not authenticated
      if (!this.currentUser) {
        this.router.navigate(['/login']);
      } else {
        this.loadRooms();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadRooms(): void {
    this.isLoading = true;
    this.chatService.getRooms().subscribe({
      next: (response) => {
        this.rooms = response.rooms;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.errorMessage = 'Failed to load rooms. Please try again.';
        this.isLoading = false;
      }
    });
  }

  createRoom(): void {
    if (!this.newRoomName.trim()) return;

    this.chatService.createRoom(this.newRoomName).subscribe({
      next: () => {
        this.loadRooms();
        this.newRoomName = '';
      },
      error: (error) => {
        console.error('Error creating room:', error);
        this.errorMessage = 'Failed to create room. It may already exist.';
      }
    });
  }

  joinRoom(roomName: string): void {
    this.router.navigate(['/room', roomName]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}