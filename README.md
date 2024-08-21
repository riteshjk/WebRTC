# WebRTC

# Passing TOkens from the cookies
Steps to follow to store the access toekn and refresh token in cookies.
1. Create a refresh model with userId and token in it
2. now create a service to create a refreshTokenModel to store the token in database 
3. In controller writing the logic passing the value which is userId and token and passing both the token from cookies


# File Upload
1. in input tag we will pass type as a file and we will recive it like const = e.target.files[0]
2. now we have to use browser inbuilt api 
3. we have image in file format we have to convert it in base64 string format and we will pass that string from src
4. so we are using FileReader for that whoich is inbuilt in browser apis
5. we have to store it like const reader = new FileReader()
6. now next step is reader.readAsDataUrl(file) so it will take time to load the file so we have one more inbuilt function which will execute this operation reader.onloadend
7. now we are going to store the result in our local veriable 
8. after done with those steps so now we have to store our file on server so and once we done with this file and name update we will activate the user so he/she can visit the rooms page


# Activate user
1. This is the importatnt steps because we have send this paramenters which is active and initially it is false once user update their name and avatar and complete the authentication in that case we have to allow user to visit rooms
2. so we create the activated controller and in routes pass the middleware whcih is check user is authenticated or not with token using cookies
3. now here once user pass the data we have avatar in base64 string format so we have to convert it to show the image so will use the buffer for that which is inbuilt mobule in nodejs
4. will use jimp package to compress the size of the image

# Refresh Token
1. so once user login it will create accesToken and refreshToken but accesToken will get expired after perticular time so we need to recreate the accestoken with the help of refresh token and refresh token
2. now for this I follow those steps from the backend
       1. get refresh token from cookie
       2. check if token is valid
       3. Check if token is in db
       4. check if valid user
       5. Generate new tokens
       6. Update refresh token
       7. put in cookie
   those steps are done from the backedn so from th frontend we just need to trigger the route so it will automatically generate the token for user and refresh
3. now from the frontend will create Interceptors in index.js which is inside the http
4. here when will get the response status which is 401 and other parameters also will trigger the backend api and get the refresh token 

