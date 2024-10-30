import { animals } from "./animals";
import React from "react";
import { createRoot } from "react-dom/client";



const root = createRoot(document.getElementById("app"));
const title = "";
const background = (
  <img className="background" alt="ocean" src="/images/ocean.jpg" />
);

function displayFact(e) {
  const name = e.target.alt;
  const animal = animals[name];
  const factIndex = Math.floor(Math.random() * animal.facts.length);
  const fact = animal.facts[factIndex];
  const p = document.getElementById('fact');
  p.innerHTML=fact;
};

const images = Object.entries(animals).map(([animal, info]) => (
  <img 
    key={animal}        
    className="animal" 
    src={info.image}    
    alt={animal} 
    onClick={displayFact}
    width='250'
  />
));


// const images = [];
// for (const animal in animals) {
//   images.push(  
//     <img 
//       key={animal}  
//       className="animal" 
//       src={animals[animal].image}
//       alt={animal}                  
//     />
//   );
// }

const main = (
  <div>
    <h1>{title ? title : "Click an animal for a fun fact"}</h1>

    <div className="animals">{images}</div>
    <p id='fact'></p>
  </div>
);

root.render(main);
