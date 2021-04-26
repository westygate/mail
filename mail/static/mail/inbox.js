document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-submit').addEventListener('click', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

window.onpopstate = function(event) {
  if (event.state.mailbox != null) {
    console.log(event.state.mailbox);
    activate_button(event.state.mailbox);
    load_mailbox(event.state.mailbox);
  }
  if (event.state.email != null) {
    console.log(event.state.email);
    view_email(event.state.email);
  }
  if (event.state.compose != null) {
    console.log(event.state.compose);
    compose_email();
  }
   
};

function compose_email() {
  
  history.pushState({compose: true}, "", "");
  activate_button('none');
  // Show compose view and hide other views
  document.querySelector('#one-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#one-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  history.pushState({mailbox: mailbox}, "", "");
  document.querySelector('#emails-table').remove();
  

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
      console.log(emails);
      const table = document.createElement('table');
      table.setAttribute("id", "emails-table");
      document.querySelector('#emails-view').append(table);
      emails.forEach ( (item) => {
        const container = document.createElement('tr');
        container.setAttribute("class", "email");
        container.addEventListener('click', () => view_email(item.id));
        document.querySelector('#emails-table').append(container);
        if (item.read) 
          container.style.backgroundColor="gainsboro";
        else
          container.style.backgroundColor="white";

        
        const sender = document.createElement('td');
        sender.innerHTML = item.sender;
        sender.setAttribute ("class", "sender-emails");
        container.append(sender);
              
        const subject = document.createElement('td');
        subject.innerHTML = item.subject;
        subject.setAttribute ("class", "subject-emails");
        container.append(subject);
        
        const timestamp = document.createElement('td');
        timestamp.innerHTML = item.timestamp;
        timestamp.setAttribute ("class", "timestamp-emails");
        container.append(timestamp);
      });
  });
  
}

function view_email(id) {
  
  document.querySelector('#one-email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  activate_button('none');
  history.pushState({email: id}, "", "");
  
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);
    document.querySelector('#reply').addEventListener('click', () => reply_email(email.id));
    
    const sender = document.querySelector('#sender');
    sender.innerHTML = "From: " + email.sender;
    
    const recipients = document.querySelector('#recipients');
    recipients.innerHTML = "To: " + email.recipients;
              
    const subject = document.querySelector('#subject');
    subject.innerHTML = email.subject;
    
    const body = document.querySelector('#body');
    body.innerHTML = email.body;
        
    const timestamp = document.querySelector('#timestamp');
    timestamp.innerHTML = email.timestamp;
    

    
    const archived = document.querySelector('#to_archived');
    if (email.archived) {
        archived.style.display = 'none';
    }
    else {
        archived.style.display = 'block';
        archived.addEventListener('click', () => email_to_archive(email.id));
    }
  });


    
  fetch(`/emails/${id}`, {
  method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}

function email_to_archive(id) {
    fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
  .finally(() => {
    activate_button('inbox');
    load_mailbox('inbox');
  });
}

function handleErrors(response) {
    if (!response.ok) {
        throw response;
    }
    return response;
}

function send_email() {
  recipients=document.querySelector('#compose-recipients').value;
  subject=document.querySelector('#compose-subject').value;
  body=document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(handleErrors)
  .then(function(response) {
    return response.json();
  })
  .then(result => {
    // Print result
    console.log(result);
    
    
  })
  .catch(error => {
    return error.json().error;
  })
  .finally (()=> {
    activate_button('sent');
    load_mailbox('sent');
  });
  

}

function reply_email(id) {
  
  document.querySelector('#one-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#compose-recipients').value = email.sender;
    
    const subject = email.subject.startsWith('Re:')? email.subject : 'Re:'+ email.subject;
    document.querySelector('#compose-subject').value = subject;
    const body = 'On ' + email.timestamp + ' ' + email.sender + ' wrote:\n' + email.body;
    document.querySelector('#compose-body').value = body;
  });
}
