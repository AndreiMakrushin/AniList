<template>
    <div>
      <label class="relative inline-block w-[45px] h-[25px]">
        <input type="checkbox" class="opacity-0 w-0 h-0" />
        <span class="switch round" @click="$emit('mode', $event.target)"></span>
      </label>
    </div>
  </template>
  
  <style scoped>
  .switch {
    border: 1px solid #ccc;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: lightcyan;
    transition: 0.4s;
  }
  
  .switch:before {
    position: absolute;
    content: '';
    height: 17px;
    width: 17px;
    left: 4px;
    bottom: 4px;
    background-image: url('@/assets/img/sun.png');
    background-size: cover;
    transition: 0.4s;
  }
  
  input:checked + .switch {
    background-color: #212331;
  }
  
  input:checked + .switch:before {
    transform: translateX(17px);
    background-image: url('@/assets/img/moon.png');
  }
  
  .switch.round {
    border-radius: 15px;
  }
  
  .switch.round:before {
    border-radius: 50%;
  }
  </style>
  