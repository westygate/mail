document.addEventListener('DOMContentLoaded', function() {

  document.querySelector('#inbox').addEventListener('click', () => activate_button('inbox'));
  document.querySelector('#sent').addEventListener('click', () => activate_button('sent'));
  document.querySelector('#archived').addEventListener('click', () => activate_button('archived'));

});

function activate_button(button_id) {
    switch (button_id) {
        case 'inbox':
            var button=document.querySelector('#inbox');
            button.style.borderBottomStyle = "solid";
            button.style.borderBottomColor = "red";
            document.querySelector('#sent').style.borderBottom = "none";
            document.querySelector('#archived').style.borderBottom = "none";
            break;
        case 'sent':
            button=document.querySelector('#sent');
            button.style.borderBottomStyle = "solid";
            button.style.borderBottomColor = "blue";
            document.querySelector('#inbox').style.borderBottom = "none";
            document.querySelector('#archived').style.borderBottom = "none";
            break;
        case 'archived':
            button=document.querySelector('#archived');
            button.style.borderBottomStyle = "solid";
            button.style.borderBottomColor = "green";
            document.querySelector('#inbox').style.borderBottom = "none";
            document.querySelector('#sent').style.borderBottom = "none";
            break;
        case 'archived':
            button=document.querySelector('#archived');
            button.style.borderBottomStyle = "solid";
            button.style.borderBottomColor = "green";
            document.querySelector('#inbox').style.borderBottom = "none";
            document.querySelector('#sent').style.borderBottom = "none";
            break;
        case 'none':
            document.querySelector('#archived').style.borderBottom = "none";
            document.querySelector('#inbox').style.borderBottom = "none";
            document.querySelector('#sent').style.borderBottom = "none";
            break;
    }
  
}