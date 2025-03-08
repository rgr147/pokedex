function addAnimationBars(poke) {
    const headHtmlForInputStyle = document.getElementById("head");

    newHtmlStyle = `
        <style id="barsStyle">
            @keyframes bar-hp {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${poke.stats.hp}%};
            }
            .bar-hp {
                width: ${poke.stats.hp}%;
                animation: bar-hp 1s;
            }

            @keyframes bar-attack {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${poke.stats.attack}%;
                }
            }
            .bar-attack {
                width: ${poke.stats.attack}%;
                animation: bar-attack 1s;
            }

            @keyframes bar-defense {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${poke.stats.defense}%;
                }
            }
            .bar-defense {
                width: ${poke.stats.defense}%;
                animation: bar-defense 1s;
            }
            
            @keyframes bar-sp-attack {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${poke.stats["special-attack"]}%;
                }
            }
            .bar-sp-attack {
                width: ${poke.stats["special-attack"]}%;
                animation: bar-sp-attack 1s;
            }

            @keyframes bar-sp-defense {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${poke.stats["special-defense"]}%;    
                }
            }
            .bar-sp-defense {
                width: ${poke.stats["special-defense"]}%;
                animation: bar-sp-defense 1s;
            }
            
            @keyframes bar-speed {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${poke.stats.speed}%
                }
            }
            .bar-speed {
                width: ${poke.stats.speed}%;
                animation: bar-speed 1s;
            }

            @keyframes bar-total {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${poke.totalPercentage}%;
                }
            }
            .bar-total {
                width: ${poke.totalPercentage}%;
                animation: bar-total 1s;
            }



        </style>
    `
    headHtmlForInputStyle.innerHTML += newHtmlStyle;
}