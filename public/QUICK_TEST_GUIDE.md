# 🎥 Group Video Call - Quick Test Guide

## ✅ What We Fixed

Your backend Socket.IO server (socket.ts) was already correctly implemented! The issue was likely in the frontend integration. Here's what we've done:

### Files Created:
1. **video-call-demo.html** - Complete working demo (use this to test!)
2. **VideoCallComponent.tsx** - React component for your frontend
3. **VideoCallComponent.css** - Styling for the React component
4. **VIDEO_CALL_GUIDE.md** - Comprehensive documentation
5. **app.ts** - Updated to serve static files

## 🚀 Test It Right Now! (2 minutes)

### Step 1: Verify Server is Running
Your server should already be running. If not:
```bash
cd d:\NEXIO-backend
npm run dev
```

### Step 2: Open the Demo
Open these URLs in **2 DIFFERENT browser tabs**:
- Tab 1: http://localhost:5000/video-call-demo.html
- Tab 2: http://localhost:5000/video-call-demo.html

### Step 3: Test the Call
In **BOTH tabs**:
1. Leave the Classroom ID as "test-room" (or enter any same ID)
2. Click **"Join Call"**
3. Allow camera/microphone when prompted
4. You should see your own video
5. In a few seconds, you should see the other tab's video!

### Step 4: Test Controls
- Click "Toggle Video" to turn camera on/off
- Click "Toggle Audio" to mute/unmute
- Click "Leave Call" to disconnect

## 🎯 Integration into Your Frontend

Once the demo works, integrate the React component:

### 1. Copy Files to Your Frontend
Copy these files from `d:\NEXIO-backend\public\` to your frontend:
- VideoCallComponent.tsx → Your frontend's components folder
- VideoCallComponent.css → Your frontend's styles folder

### 2. Install Dependencies (if not already)
```bash
npm install socket.io-client
```

### 3. Use the Component
```tsx
import VideoCallComponent from './components/VideoCallComponent';
import './styles/VideoCallComponent.css';

function ClassroomPage({ classroomId }) {
  return (
    <div>
      <h1>Classroom {classroomId}</h1>
      <VideoCallComponent
        classroomId={classroomId}
        serverUrl="http://localhost:5000"
        onError={(error) => {
          console.error('Video call error:', error);
          alert(error);
        }}
        onUserJoined={(userId) => {
          console.log('User joined:', userId);
        }}
        onUserLeft={(userId) => {
          console.log('User left:', userId);
        }}
      />
    </div>
  );
}
```

## 🐛 If It Doesn't Work

### Check 1: Server Running?
```bash
# You should see: "Server is running on :5000"
# And: "Socket.IO server initialized"
```

### Check 2: Can Access Demo?
Open: http://localhost:5000/video-call-demo.html
- Should see the video call interface
- If you get 404, the static file serving isn't working

### Check 3: Browser Console
Press F12 to open developer tools, check for errors:
- Should see: "Connected to server: [socket-id]"
- Should NOT see any red errors

### Check 4: Camera/Microphone
- Click "Join Call"
- Browser should prompt for permission
- If denied, click the camera icon in address bar to allow

### Check 5: Two Tabs Test
- Open demo in TWO tabs
- Both should show "Connected to server"
- After joining, both should see each other's video

## 📱 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| No camera/mic access | Allow permissions in browser |
| 404 on demo.html | Server not serving static files |
| "Socket disconnected" | Backend not running or wrong port |
| Videos not connecting | Check firewall/antivirus |
| Only see own video | Open in 2 tabs/browsers |

## 🎨 Customization

### Change Server URL
Edit line 220 in video-call-demo.html:
```javascript
socket = io('http://YOUR_SERVER:PORT', {
```

Or in React component:
```tsx
<VideoCallComponent serverUrl="http://YOUR_SERVER:PORT" />
```

### Change Video Quality
In the component, find `getUserMedia` and modify:
```javascript
video: {
  width: { ideal: 1920 },  // 1080p
  height: { ideal: 1080 },
  frameRate: { ideal: 30 }
}
```

## 📊 Expected Flow

```
User opens demo
  ↓
Clicks "Join Call"
  ↓
Browser asks for camera/microphone permission
  ↓
User allows
  ↓
Sees own video (mirrored)
  ↓
Socket connects to server
  ↓
User joins room "test-room"
  ↓
[In another tab/browser]
  ↓
Second user joins same room
  ↓
Both users' videos appear for each other
  ↓
Success! 🎉
```

## 🔧 Advanced: Production Deployment

For production, you'll need:

1. **HTTPS** (required for WebRTC)
2. **TURN Server** (for users behind strict firewalls)
3. **Authentication** (to secure rooms)
4. **Rate Limiting** (prevent abuse)

See VIDEO_CALL_GUIDE.md for details!

## ✨ Your Backend Was Already Good!

Your socket.ts implementation was perfect! It properly handles:
- ✅ Room joining
- ✅ WebRTC signaling (offers/answers)
- ✅ ICE candidate exchange
- ✅ User leaving
- ✅ Disconnect cleanup

The frontend demo we created shows how to use it correctly!

---

**Next Steps:**
1. Test the demo (2 tabs)
2. Verify it works
3. Integrate React component into your frontend
4. Customize as needed

**Need Help?**
Check the browser console (F12) for detailed logs and errors.
