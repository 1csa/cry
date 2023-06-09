import React, { FC, useState, useEffect, useRef } from 'react';
import useClickOutside from './useClickOutside'

import './index.less'

interface itemProps {
  key: string,
  value: string,
}

interface mainProps {
  style?: React.CSSProperties,
  placeholder?: string,
  listData?: itemProps[],
  value?: string,
  handleActivitySelected?: Function,
  onChange?: Function,
}

const SpSelect: FC<mainProps> = (props) => {
  const {
    style, placeholder, listData = [],
    value = '', handleActivitySelected, onChange
  } = props

  const [showCtn, setShowCtn] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [addInputValue, setAddInputValue] = useState<string>('')
  const [currentListData, setCurrentListData] = useState<itemProps[]>([])
  
  const componentRef = useRef<HTMLSpanElement>(null)
  useClickOutside(componentRef, () => { setShowCtn(false)})

  useEffect(() => {
    setSelectedValue(value)
    setInputValue(value)
    setCurrentListData(listData)
  }, [value, listData])

  const handleSelectItem = (v: string) => {
    setSelectedValue(v)
    setInputValue(v)
    setShowCtn(false)
    if (handleActivitySelected) {
      handleActivitySelected(v)
    }
    if (onChange) {
      onChange(v)
    }
  }

  const handleInputBlur = (v: string) => {
    if (handleActivitySelected) {
      handleActivitySelected(v)
    }
    if (onChange) {
      onChange(v)
    }
  }

  const handleFilterItem = (): itemProps[] => {
    let result: itemProps[] = []
    result = currentListData.filter(item => {
      return item.value.indexOf(inputValue) > -1
    })
    return result
  }

  const handleAddItem = () => {
    let arr:itemProps[] = currentListData
    let str = addInputValue.trim()
    if (str !== '') {
      arr = [...currentListData, {
        key: str,
        value: str,
      }]
      setCurrentListData(arr)
      setAddInputValue('')
      setInputValue('')
    }
  }

  const handleInputValueChange = (v: string)=> {
    setInputValue(v)
    setSelectedValue(v)
  }

  return (
    <span id="spSelectCtn" style={style} ref={componentRef}>
      <input
        value={inputValue}
        className="spSelectInp"
        placeholder={placeholder}
        onFocus={() => {setShowCtn(true)}}
        onBlur={(e) => {handleInputBlur(e.currentTarget.value)}}
        onChange={(e) => {handleInputValueChange(e.currentTarget.value)}}
      />
      {
        showCtn &&
        <ul className="spUlCtn">
          {
            // handleFilterItem().map(item => {
            currentListData.map(item => {
              // if (item.value.indexOf(inputValue) > -1) {
                return <li
                  className={`spLiCtn ${selectedValue === item.key ? 'active' : ''}`}
                  key={item.key}
                  onClick={() => {handleSelectItem(item.key)}}
                  >
                    {item.value}
                  </li>
              // }
            })
          }
          {/* <li
            key="addItemBar"
            className="addItemCtn"
            >
              <span className="addIcon" onClick={() => {handleAddItem()}}>+</span>
              <input
                className="spSelectInp"
                value={addInputValue}
                onChange={(e) => {setAddInputValue(e.currentTarget.value)}} />
            </li> */}
        </ul>
      }
    </span>
  );
}

export default SpSelect;
