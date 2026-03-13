<img src="./frontend/public/sprites/chicken/hehe.webp" height="100" />

# ChickenScratch - HackBU 2026 Submission

Created by Kenneth Ng, Tiffany Lin, and Ryan Zhou for HackBU 2026. (Runner-Up
of Best Beginner Hack Award)

## Program Purpose

The purpose of our program is to create a game where kids of all ages can
practice their handwriting by themselves or with others.

We wanted to create an education experience for younger kids, while maintaining
an engaging atmosphere for older kids. We created this program because we have
experienced having bad handwriting ourselves, and we know that teachers sometimes
have a hard time reading people's handwriting.

This game is meant for kids, or anyone, to practice their handwriting or compete
with others for fun while improving their writing skills.

## Program Functionality

The program connects your phone camera via a QR code, which first ensures your
phone is centered on the paper. You can then choose Practice or Race mode.

In Race mode, the game starts once another player joins. Random words appear,
and you write them neatly on paper. Players are connected through websockets
(Socket.IO), allowing real-time communication.

Our backend (Express) converts Base64 strings into images, enhances them, and
processes them through a YOLO-trained model (FastAPI). Every 30 seconds, the
words become harder, and correct answers earn points. At the end, the player
with the most points wins, displaying either a winner or loser screen.

## Our Tech Stack

- Frontend:
  - Nuxt.js (Vue.js) + TypeScript
  - TailwindCSS
    - DaisyUI
- Backend:
  - Express.js + TypeScript
  - Socket.IO
- Model:
  - FastAPI (Python)
  - YOLOv8 (Ultralytics)
  - OpenCV
  - our blood sweat and tears

## AI Usage

- AI was used to debug parts of our code
