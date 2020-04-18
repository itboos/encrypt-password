/* eslint-disable jsx-a11y/alt-text  */
import React, { Component } from 'react';
import { getUrlParams, decodeBase64 } from '../assets/js/utils'
import { Encrypt, Decrypt } from '../assets/js/aes.js'
import ClipboardJS from 'clipboard'

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      saltPwd: '', // aes salt pwd
      originPwd: '',
      encryptStr: '',
      output: '',
      tooltip: '',
      hiddenTooltip: true,
      timeId: -1,
      defaultPwd: 'password' // default salt pwd
    }
  }

  componentDidMount() {
    const queryObj = getUrlParams()
    const pwd = decodeBase64(queryObj['data'] || '')
    const saltPwd = pwd ? pwd : this.state.defaultPwd
    console.log('saltPwd:', saltPwd)
    this.setState({
      saltPwd,
    })

    const clipboard = new ClipboardJS('.copy-btn');
    clipboard.on('success', e => {
        console.info('Text:', e.text);
        e.clearSelection();
        clearTimeout(this.state.timeId)

        let timeId
        if (this.state.timeId === -1) {
          timeId = setTimeout(() => {
            this.setState({
              hiddenTooltip: true,
              timeId: -1
            })
          }, 3000)
        }
        this.setState({
          tooltip: 'Copied',
          hiddenTooltip: false,
          timeId
        })
    });

    clipboard.on('error', e => {
       console.log('copy error:', e)
       let timeId
       if (this.state.timeId === -1) {
          timeId = setTimeout(()  => {
            this.setState({
              hiddenTooltip: true,
              timeId: -1
            })
          }, 3000)
       }

       this.setState({
        tooltip: 'Failed',
        hiddenTooltip: false,
        timeId
      })
    });
  }

  handleSaltInputChange = e => {
    const saltPwd = e.target.value.trim()
    this.setState({
      saltPwd
    })
  }

  handleOriginInputChange = e => {
    const originPwd = e.target.value.trim()
    this.setState({
      originPwd,
      encryptStr: '',
      output: '',
    })
  }

  handleEncryptInputChange = e => {
    const encryptStr = e.target.value.trim()
    this.setState({
      encryptStr,
      originPwd: '',
      output: ''
    })
  }
  
  handleEncrypt = () => {
    const { saltPwd, originPwd } = this.state
    const encryptStr = Encrypt(saltPwd, originPwd)
    this.setState({
      output: encryptStr
    })
  }

  handleDecrypt = () => {
    const { saltPwd, encryptStr } = this.state
    const decryptStr = Decrypt(saltPwd, encryptStr)
    this.setState({
      output: decryptStr
    })
  }

  handleReset = () => {
    this.setState({
      encryptStr: '',
      originPwd: '',
      output: '',
      tooltip: '',
      timeId: -1
    })
  }

  render() {
    const { encryptStr, originPwd, saltPwd, output, tooltip, hiddenTooltip } = this.state
    return (
      <div className="personal-form">
        <h3>AES-CTR 加解密</h3>
        <div className="row">
        <label>密码：</label>
        <input type="text"
          value={ saltPwd }
          onChange = { this.handleSaltInputChange }
          placeholder="请输入 AES 加密密码" />
      </div>

        <div className="row">
          <input type="text" 
            id="input-encrypt"
            placeholder="请输入待加密字符串"
            value = { originPwd }
            onChange = { this.handleOriginInputChange }/>
          <div className="encrypt-btn btn" onClick={this.handleEncrypt}>加密</div>
        </div>

        <div className="row">
          <input type="text"
            id="out-encrypt"
            placeholder="请输入解密字符串"
            value = { encryptStr }
            onChange = { this.handleEncryptInputChange }
          />
          <div className="decrypt-btn btn" onClick={ this.handleDecrypt }>解密</div>
        </div>

        <div className="result row">
           <label>结果：</label>
           <input type="text" id="output" value={ output } readOnly data-clipboard-text={ output } />
           <span className="input-group-button">
              <button className="copy-btn" type="button" data-clipboard-demo="" data-clipboard-target="#output">
                <img className="clippy" src="https://cdn.jsdelivr.net/gh/itboos/static-file-2020@master/imgs/common/clippy.svg" width="13" alt="Copy to clipboard" />
              </button>
              <span className="tooltip" hidden={ hiddenTooltip }>{ tooltip }</span>
           </span>
        </div>
        <div className="row" onClick={ this.handleReset }><div className="btn clear-btn">清空所有</div></div>
      </div> 
    );
  }
}
export default Main;