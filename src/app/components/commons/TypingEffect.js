import React, { useEffect, useRef } from 'react';

export default function TypingEffect(props) {
  const textRef = useRef(props.text);

  useEffect(() => {
    function typeWriter(i = 0) {
      if (i < props.text.length) {
        textRef.current.innerHTML += props.text.charAt(i);
        i++;
        setTimeout(() => {
          typeWriter(i);
        }, 50);
      }
    }

    typeWriter();
  }, [props.text]);

  return (
    <span className={"typing-effect"} ref={textRef}/>
  )
}
