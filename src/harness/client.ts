import {Client} from '../Client'

const template = `
<h1>U2f Proxy Client</h1>
<h2>Actions</h2>
<button id="is-supported">Is Supported?</button>
<button id="ensure-support">Ensure Support</button>
<h2>Output</h2>
<div>
<pre id="output"></pre>
</div>
`

window.onload = () => {
  const el = document.createElement('div');
  el.innerHTML = template;
  document.body.appendChild(el);

  const client = new Client({
    frameUrl: 'https://localhost:9001'
  });

  const output = document.getElementById('output')!;
  document.getElementById('is-supported')!.addEventListener('click', () => {
    client.isSupported().then(addText).catch(addText)
  })
  document.getElementById('ensure-support')!.addEventListener('click', () => {
    client.ensureSupport().then(addText).catch(addText)
  })

  function addText (data: any) {
    const currText = output.textContent;
    output.textContent = currText + `Output ${Date.now()} \n\n ${(data || 'No response').toString()} \n--------\n\n\n\n`
  }
}