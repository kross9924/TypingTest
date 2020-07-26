var wordsSpan = document.querySelectorAll(".wordsSpan");
var input = document.querySelector("#typing");
var timeLeftMin = document.querySelector("#timeLeftMin");
var timeLeftSec = document.querySelector("#timeLeftSec");
var result = 0;
var typingSpeed = document.querySelector("#typingSpeed");
var start ;
var correctWord = 0;
var wrongWord = 0;
var i = 0;
wordsSpan[i].classList.add("highlight");
var current = "";
input.addEventListener("keydown",event=>{
    if(event.keyCode===32){
        
        current = input.value;
        if(current[0]===" "){
            c1=  " "+ wordsSpan[i].innerHTML;
        }else{
            c1=wordsSpan[i].innerHTML;
        }
        if(current===c1){
            wordsSpan[i].classList.remove("highlight");
            wordsSpan[i].classList.add("done");
            correctWord++;

        }else{
            wordsSpan[i].classList.remove("highlight");
            wordsSpan[i].classList.add("wrong");
            wrongWord++;
        }
        input.value = "";
        i++;
        if(wordsSpan[i].innerHTML==="")
        i++;
        wordsSpan[i].classList.add("highlight");
    }else{
        if(start === undefined){
            start = new Date().getTime();
        }
    }
});

setInterval(function(){

        if(start){
            var current = new Date().getTime();

            var diff = (current-start)/60000;
            var Timediff = diff*60;
            var timePassedMin = Math.ceil(diff);

            if(Timediff<300){
                
                timeLeftMin.innerHTML = 5-timePassedMin;
                timeLeftSec.innerHTML = Math.floor(60-(Timediff%60));
                var wpm = Math.floor(correctWord/diff);
                typingSpeed.innerHTML = wpm;
                result = wpm;
            }else{
                var rdate = new Date();
                post('/result/',{result:result});
            }
        }
        
},1000);


function post(path, params, method='post') {

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
  
        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
  }




