console.log("I am here");

const socket=io("http://localhost:5000");

const messageForm=document.querySelector(".chatbox form");
const messageList=document.querySelector("#messagelist");
const userList=document.querySelector("ul#users");
const chatboxinput=document.querySelector(".chatbox form input");
const useraddform=document.querySelector(".modal");
const backdrop=document.querySelector(".backdrop")
const useraddinput=document.querySelector(".modal input");



const messages=[];
// list of added users
let users=[];

//Socket listeners
socket.on("message_client",(message)=>{
     messages.push(message);
    updateMessages();
})

socket.on("users",(_users)=>{
   
    users=_users;
    updateUsers();
})

//Event listeners
messageForm.addEventListener("submit",messageSubmitHandler);
useraddform.addEventListener("submit",userAddHandler);

function messageSubmitHandler(e){
    let message=chatboxinput.value;
    e.preventDefault();
    if(!message){
       return alert("message must not be empty");
    }else{
        socket.emit("message",message);
    }
    
}

function updateMessages(){
    messageList.textContent="";
    for(let i=0; i<messages.length;i++){
        messageList.innerHTML+=`<li>
        <p> ${messages[i].user}</p>
        <p> ${messages[i].message}</p>
        </li>`
    }
}

function updateUsers(){
    userList.textContent="";
    let node;
    for(let i=0; i<users.length;i++){
        // create a list
        let node=document.createElement('li');
        // create a text node
        let textNode=document.createTextNode(users[i]);
        // add text node to the list
        node.appendChild(textNode);
        // add node to the user list
        userList.appendChild(node);
    }
}

function userAddHandler(e){
   e.preventDefault();
   let username=useraddinput.value;
   
   if(!username){
    return alert("You must add a user name");
   }else{
    socket.emit("addUser",username);
    useraddform.classList.add("disappear");
    backdrop.classList.add("disappear");
   }
}

