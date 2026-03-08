# luck-be-u

## Project Setup

1. run the [backend](./backend/README.md) first

2. then run the [frontend](./frontend/README.md)

## HackBU 2026 Submission 
Created by Kenneth Ng, Tiffany Lin, and Ryan Zhou

Program Purpose
----------------------------------------------------------------
The purpose of our program is to create a game where kids can practice their handwriting by themselves or with others. Kids, adults, and elders can also play against each other for fun. We created this program because we have experienced having bad handwriting ourselves, and we know that teachers sometimes have a hard time reading people's handwriting. This game is meant for kids, or anyone, to practice their handwriting or compete with others for fun while improving their writing skills.

Program Functionality
----------------------------------------------------------------
The program connects your phone camera via a QR code, which first ensures your phone is centered on the paper. You can then choose Practice or Race mode. In Race mode, the game starts once another player joins. Random words appear, and you write them neatly on paper. Our backend (FastAPI) converts Base64 strings into images, enhances them, and processes them through a YOLO-trained model (.pt file). Every 30 seconds, the words become harder, and correct answers earn points. At the end, the player with the most points wins, displaying either a winner or loser screen.

AI Usage
----------------------------------------------------------------
- AI was used to debug parts of our code