const template = document.createElement('template');

template.innerHTML = `
  <style>
  .container{
    height:100%;
  }
   .button__base{
      width: 60%;
      height: 60%;
      background-color: red;
      border: 4px solid white;
      line-height: 1.5;
      margin: 13% 26%;
      position: relative;
      -webkit-transition: all 0.05s ease-in;
      transition: all 0.05s ease-in;
   }
   .button__base.is-pressed {
      background-color: orange;
      cursor: default;
      -webkit-transform: translate(calc(-10% + 1px), calc(10% - 1px));
              transform: translate(calc(-10% + 1px), calc(10% - 1px));
    }
    .button__base.is-pressed::before {
  width: 10%;
}
.button__base.is-pressed::after {
  height: 10%;
}
.button__base::before, .button__base::after {
  border: 4px solid white;
  content: '';
  background: red;
  position: absolute;
  -webkit-transition: all 0.05s ease-in;
  transition: all 0.05s ease-in;
}
.button__base::before {
  width: 20%;
  height: calc(100% + 2px);
  border-right: 0;
  border-bottom-width: 2px;
  -webkit-transform: skew(0deg, -45deg) translateX(-4px);
          transform: skew(0deg, -45deg) translateX(-4px);
  -webkit-transform-origin: top right;
          transform-origin: top right;
  top: -8px;
  right: 99%;
}
  .button__base::after {
    width: calc(100% + 1px);
    height: 20%;
    border-top: 0;
    border-left-width: 3px;
    -webkit-transform: skew(-45deg, 0deg) translateY(4px);
            transform: skew(-45deg, 0deg) translateY(4px);
    -webkit-transform-origin: top right;
            transform-origin: top right;
    top: 100%;
    right: -8px;
  }
  .button__base__rainbow {
    position: absolute;
    top: 40%;
    left: 40%;
    z-index: 90;
    font-size: 0;
  }
  .button__base__rainbow.has-rainbow {
    -webkit-animation: rainbowFound 1s ease-in-out alternate infinite;
            animation: rainbowFound 1s ease-in-out alternate infinite;
    font-size: 28px;
  }
  .p-btn {
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  </style>
  <div class="container">
    <button class="button__base p-btn">Label</button>
  </div>
`;

class Button extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$container = this._shadowRoot.querySelector('.container');
    this.$button = this._shadowRoot.querySelector('button');
    
    this.$button.addEventListener('click', () => {
      this.$button.classList.add('is-pressed');
    });
  }

  connectedCallback() {
    if (this.hasAttribute('as-atom')) {
      this.updateAsAtom();
    }
  }

  updateAsAtom() {
    this.$container.style.padding = '0px';
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get id() {
    return this.getAttribute('id')
  }
  
  get className() {
    return this.getAttribute('className')
  }

  set id(value) {
    return this.setAttribute('id', value)
  }

  get onClick(){
    return this.getAttribute('onClick')
  }

  set onClick(value){
    return this.setAttribute('onClick', value)
  }


  static get observedAttributes() {
    return ['label', 'id', 'onClick', 'className'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {
    this.$button.innerHTML = this.label;
    this.$button.id = this.id;
    this.$button.onClick = this.onClick;
    

  }
}

window.customElements.define('road-button', Button);