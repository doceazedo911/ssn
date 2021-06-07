function ripple(event) {
  const button = event.currentTarget;

  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const vpOffset = button.getBoundingClientRect();

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.pageX - scrollX - (vpOffset.left + radius)}px`;
  circle.style.top = `${event.pageY - scrollY - (vpOffset.top + radius)}px`;

  const otherCircle = button.getElementsByTagName('span')[0];
  if (otherCircle) otherCircle.remove();

  button.appendChild(circle);
}

function copyIP() {
  const el = document.createElement('textarea');
  el.value = copyAddress;
  document.body.appendChild(el);
  el.select();
  document.execCommand('Copy');
  el.remove();

  copyBtn.classList.add('copied');
  setTimeout(() => {
    copyBtn.classList.remove('copied');
  }, 2500);
}

function ruleOfThree() {
  let result = 0;
  if (rotInput.value >= 5) result = parseInt((rotInput.value * 30) / 20);
  
  document.querySelector('#doar span').innerHTML = result;
}

function fetchDonations() {
  fetch(`data.json?day=${new Date().getDate()}`)
    .then(resp => resp.json())
    .then(data => {
      document.querySelectorAll('#sobre span')[0].innerHTML = data.map.size;
      document.querySelectorAll('#sobre span')[1].innerHTML = data.map.updatedAt;
      document.querySelectorAll('#meta h2')[0].innerHTML = data.currentGoal;

      let donations = '';
      let donationAmount = 0;
      data.thisMonth.forEach(donation => {
        donationAmount += donation.amount;
        donations += `
        <tr>
          <td>${donation.day}</td>
          <td>${donation.username}</td>
          <td>R$${donation.amount}</td>
        </tr>`;
      });
      document.querySelector('#donations tbody').innerHTML = donations;
      document.querySelector('.progress + label span').innerHTML = donationAmount;
      if (!donationAmount) donationAmount = 1;
      document.querySelector('.progress span').style.width = `${donationAmount}%`;

      let goals = '';
      data.pastMonths.forEach(goal => {
        goals += `
        <tr>
          <td>${goal.month}</td>
          <td>R$${goal.amount}</td>
        </tr>`;
      });
      document.querySelector('#goals tbody').innerHTML = goals;
    });
}

document.querySelectorAll('main > div:first-child a').forEach(button => {
  button.addEventListener('click', ripple);
});

const copyBtn = document.querySelectorAll('main > div:first-child a')[0];
const copyAddress = 'servidorsemnome.com';
copyBtn.addEventListener('click', copyIP);

const rotInput = document.querySelector('#doar input');
rotInput.addEventListener('keyup', ruleOfThree)

document.addEventListener('DOMContentLoaded', () => {
  fetchDonations();
  if (navigator.platform !== 'Win32') document.querySelectorAll('main > div:first-child a')[2].href = 'https://tlauncher.org/jar';
});