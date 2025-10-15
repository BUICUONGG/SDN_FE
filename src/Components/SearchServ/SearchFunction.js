import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SearchFunction = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const onSearchClick = () => {
    if (value.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
    }
  };
  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
  return (
    <div style={{width: '50%',}}>
      <div style={{ 
      backgroundColor: '#FFFFFF', 
      display: 'flex',
      alignItems: 'center',
      padding : '0px 10px',
      width: '100%',
      borderRadius: '30px',
      marginLeft: '50%',
      transform: 'translateX(-50%)',
      transition: 'all 0.5s',
      border:  '1px solid #6EB566',
    }}> 
      <Input
        placeholder="Tìm..."
        bordered={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={onSearchClick}
        style={{ 
          flex: 1, 
          background : 'transparent',
          color: 'black',
          fontSize: '18px',
        }}
      />
      <SearchOutlined 
      onClick={onSearchClick}
      style={{ 
        color: 'white', 
        fontSize: '20px', 
        padding: '3px 10px', 
        background : '#6EB566' , 
        borderRadius: '40px',
        transition: 'all 0.5s'
        }} />
    </div>
    </div>
  );
};

export default SearchFunction;
