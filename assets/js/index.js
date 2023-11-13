//const { default: axios } = require("axios");




async function signUp(email,nickName,passWord) {  
    await axios.post(`${apiUrl}/users`,{
        "user": {
            "email": email,
            "nickname": nickName,
            "password": passWord
        }
    })
    .then((res)=>{
        //console.log(res);
        signUpForm.classList.add("opacity-0");
        setTimeout(()=>{
            signUpForm.classList.add("d-none");
            logInForm.classList.remove("d-none");
            setTimeout(()=>{
                logInForm.classList.remove("opacity-0");
            })
        },800);
    })
    .catch((err)=>{
        console.log(err.response);
        errSignUp.innerHTML=`<p>${err.response?.data?.message}</p>`;
        errSignUp.classList.remove("d-none");
    })
}

async function signIn(email,passWord) {  
    await axios.post(`${apiUrl}/users/sign_in`,{
        "user":{
            "email": email,
            "password": passWord
        }
    })
    .then((res)=> {
        //console.log(res);
        axios.defaults.headers.common['Authorization']=res.headers.authorization;
        emailLogIn.classList.remove("is-invalid");
        pwdLogIn.classList.remove("is-invalid")
        errLogin.classList.add("d-none");
        logInForm.classList.add("opacity-0");
        setTimeout(()=>{
            logInForm.classList.add("d-none");
            toDoList.classList.remove("d-none");
            render();
            setTimeout(()=>{
                owner.textContent=`${res.data.nickname} 的待辦`;
                toDoList.classList.remove("opacity-0");
            },400);
        },800);
    })
    .catch(err=>{
        console.log(err.response);
        errLogin.innerHTML=`<p>${err.response?.data?.message}</p>`;
        errLogin.classList.remove("d-none");
    })
}
async function signOut() {  
    await axios.delete(`${apiUrl}/users/sign_out`)
        .then((res)=>{
            //console.log(res);
            axios.defaults.headers.common['Authorization']="";
        })
        .catch(err=>{
            console.log(err.response);
        })
}
async function getToDo() {  
    await axios.get(`${apiUrl}/todos`)
    .then(async (res)=>{
        //console.log(res.data.todos);
        return data=await res.data.todos;
    })
    .catch(err=>console.log(err.reponse))
}

async function addToDo(content) {  
    await axios.post(`${apiUrl}/todos`,{
        "todo": {
            "content": content
          }
    })
    .then(res=>console.log(res))
    .catch(err=>console.log(err.response))
}

function modifyToDo(content,todoId) {  
    axios.put(`${apiUrl}/todos/${todoId}`,{
        "todo": {
            "content": content
        }
    })
    .then(res=>console.log(res))
    .catch(err=>console.log(err.response))
}

async function deleteToDo(todoId) {  
    await axios.delete(`${apiUrl}/todos/${todoId}`)
    .then(res=>console.log(res))
    .catch(err=>console.log(err.response))
}

async function statusToDo(todoId) {  
    await axios.patch(`${apiUrl}/todos/${todoId}/toggle`,{})
    .then(res=>console.log(res))
    .catch(err=>console.log(err.response))
}
async function render() {  
    await getToDo();
    //await console.log(data);
    if(data.length===0){
        cardList.classList.add("d-none");
        nonList.classList.remove("d-none");
    }else{
        cardList.classList.remove("d-none");
        nonList.classList.add("d-none");
        let str="",status="";
        //get status
        statusBtn.forEach((item)=>{
            if((item.className.includes('active'))){
                status=item.getAttribute("data-status");
            }
        })
        //render & count 
        let countWait=0;
        data.forEach((item)=>{
            if(status==="all"){
                str+=`<li class="position-relative fs-5">
            <label class="checkbox" for="">
            <input data-id="${item.id}" data-completed_at="${item.completed_at}" type="checkbox" />
            <span>${item.content}</span>
            </label>
            <a href="#" class="delete" data-id="${item.id}"></a>
            </li>`;
            }else if(status==='wait'){
                if(String(item.completed_at)==="null"){
                    str+=`<li class="position-relative fs-5">
                    <label class="checkbox" for="">
                    <input data-id="${item.id}" data-completed_at="${item.completed_at}" type="checkbox" />
                    <span>${item.content}</span>
                    </label>
                    <a href="#" class="delete" data-id="${item.id}"></a>
                    </li>`;
                }
            }else if(status==='finish'){
                if(String(item.completed_at)!=="null"){
                    str+=`<li class="position-relative fs-5">
                    <label class="checkbox" for="">
                    <input data-id="${item.id}" data-completed_at="${item.completed_at}" type="checkbox" />
                    <span>${item.content}</span>
                    </label>
                    <a href="#" class="delete" data-id="${item.id}"></a>
                    </li>`;
                }
            }
            if(item.completed_at===null){
                countWait++;
            }
        });
        list.innerHTML=str;
        listFooter.querySelector('p').textContent=`${countWait} 個待完成項目`;
        //render input
        list.querySelectorAll('input').forEach((item,index)=>{
            if(item.getAttribute("data-completed_at")!=="null"){
                list.querySelectorAll('input')[index].checked=true;
            }
        });
    }
}
//API
const apiUrl='https://todoo.5xcamp.us';
let data=[];
//login
const logInForm=document.querySelector('.logInForm');
const emailLogIn=document.querySelector('.logInForm .emailLogIn');
const pwdLogIn=document.querySelector('.logInForm .pwdLogIn');
const errLogin=document.querySelector('.errLogin');
//signUp
const signUpForm=document.querySelector('.signUpForm');
const emailSignUp=document.querySelector('.emailSignUp');
const nickName=document.querySelector('.nickName');
const pwdSignUp1=document.querySelector('.pwdSignUp1');
const pwdSignUp2=document.querySelector('.pwdSignUp2');
const errSignUp=document.querySelector('.errSignUp');
//add todolist
const search=document.querySelector('.card.input');
//todolist
const toDoList=document.querySelector('.toDoList');
const toDoHeader=document.querySelector('.toDoList .header');
let owner=document.querySelector('.owner');
const tab=document.querySelector('.tab');
const statusBtn=document.querySelectorAll('.tab li');
const cardList=document.querySelector('.card.card_list');
const nonList=document.querySelector('.nonList');
let list=document.querySelector('.cart_content .list');
const checkbox=document.querySelector('.checkbox');
//content footer
const listFooter=document.querySelector('.list_footer');

logInForm.addEventListener("click",async (e)=>{
    if(e.target.textContent==='註冊帳號'){
        logInForm.classList.add("opacity-0");
        setTimeout(()=>{
            logInForm.classList.add("d-none");
            signUpForm.classList.remove("d-none");
            setTimeout(()=>{
                signUpForm.classList.remove("opacity-0");
            })
        },800);
    }else if(e.target.textContent==='登入'){
        if((emailLogIn.value==="")||(pwdLogIn.value==="")){
            if(emailLogIn.value===""){
                emailLogIn.classList.add("is-invalid");
                emailLogIn.classList.remove("is-valid");
            }else{
                emailLogIn.classList.add("is-valid");
                emailLogIn.classList.remove("is-invalid");
            }
            if(pwdLogIn.value===""){
                pwdLogIn.classList.add("is-invalid");
                pwdLogIn.classList.remove("is-valid");
            }else{
                pwdLogIn.classList.add("is-valid");
                pwdLogIn.classList.remove("is-invalid");
            }
        }else{
            emailLogIn.classList.remove("is-invalid");
            pwdLogIn.classList.remove("is-invalid");
            emailLogIn.classList.remove("is-valid");
            pwdLogIn.classList.remove("is-valid");
            await signIn(emailLogIn.value,pwdLogIn.value);
            emailLogIn.value="";
            pwdLogIn.value="";
        }
    }
});

signUpForm.addEventListener("click",async (e)=>{
    if(e.target.textContent==='登入'){
        signUpForm.classList.add("opacity-0");
        setTimeout(()=>{
            signUpForm.classList.add("d-none");
            logInForm.classList.remove("d-none");
            setTimeout(()=>{
                logInForm.classList.remove("opacity-0");
            })
        },800);
    }else if(e.target.textContent==='註冊帳號'){
        if((emailSignUp.value==="")||(nickName.value==="")||(pwdSignUp1.value==="")||(pwdSignUp2.value==="")){
            console.log('in');
            emailSignUp.classList.remove("is-invalid");
            nickName.classList.remove("is-invalid");
            pwdSignUp1.classList.remove("is-invalid");
            pwdSignUp2.classList.remove("is-invalid");
            pwdSignUp2.classList.remove("is-invalid-1");
            if(emailSignUp.value===""){
                emailSignUp.classList.add("is-invalid");
            }
            if(nickName.value===""){
                nickName.classList.add("is-invalid");
            }
            if(pwdSignUp1.value===""){
                pwdSignUp1.classList.add("is-invalid");
            }
            if(pwdSignUp2.value===""){
                pwdSignUp2.classList.add("is-invalid");
            }
            if((pwdSignUp1.value!==pwdSignUp2.value)&&((pwdSignUp1.value!=="")&&(pwdSignUp2.value!==""))){
                pwdSignUp2.classList.add("is-invalid-1");
            }
        }else{
            await signUp(emailSignUp.value,nickName.value,pwdSignUp1.value);
        }
    }
})

//signOut
toDoHeader.querySelector('a').addEventListener("click",async (e)=>{
    await signOut();
    toDoList.classList.add("opacity-0");
    setTimeout(()=>{
        toDoList.classList.add("d-none");
        logInForm.classList.remove("d-none");
        setTimeout(()=>{
            logInForm.classList.remove("opacity-0");
        })
    },400)
})
//add todolist
search.addEventListener("click",async (e)=>{
    if(e.target.getAttribute("class").includes("btn_add")){
        let content=search.querySelector('input').value;
        search.querySelector('input').value="";
        await addToDo(content);
        await render();
    }
})
//status switch
tab.addEventListener("click",(e)=>{
    tab.querySelectorAll('li').forEach((item)=>{
        item.classList.remove("active")
    });
    e.target.classList.add("active");
    render();
});
//click todolist
list.addEventListener("click",async (e)=>{
    const id=e.target.getAttribute("data-id");
    console.log(id);
    if(e.target.getAttribute("class")==='delete'){
        await deleteToDo(id);
    }else{
        await statusToDo(id);
    }
    await render();
});
//content footer
listFooter.querySelector('a').addEventListener("click",(e)=>{
    e.preventDefault();
    getToDo();
    let finishArr=data.filter((item)=>{
        //console.log(String(item.completed_at));
        if(String(item.completed_at)!=="null"){
            return item;
        }
    })
    finishArr.forEach(async (item)=>{
        await deleteToDo(item.id);
        await render();
    });
});