/*
 Author:Jie Bao
 Load a function
*/
function addLoadEvent(func) 
{ 
  var oldonload = window.onload;  
  if (typeof oldonload == 'function') 
  { 
       window.onload = function() 
       { 
            oldonload();  func(); 
       }; 
  } 
  else 
  {  
       window.onload = func;  
  } 
}  