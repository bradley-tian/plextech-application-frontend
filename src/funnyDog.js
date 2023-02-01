import React from 'react';
import dog from './funny_dog.png';
import "./styles.css";

function FunnyDog() {
    return (
        <>
        <h4>Congratulations, you have found the funny dog.</h4>
        <img src={dog}></img>
        <p>The dog is very funny</p>
        </>
    )
}

export default FunnyDog;