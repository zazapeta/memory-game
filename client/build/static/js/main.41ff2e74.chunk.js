(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{10:function(e,n,t){e.exports={leaderboard:"game_leaderboard__3vT6W",row:"game_row__2Wfbu",name:"game_name__1KIL6",score:"game_score__2DCCq",button:"game_button__zI_u4",usernameContainer:"game_usernameContainer__2tQIV"}},22:function(e,n,t){e.exports=t.p+"static/media/front.b90e17a9.jpg"},26:function(e,n,t){e.exports=t(34)},31:function(e,n,t){},34:function(e,n,t){"use strict";t.r(n);var a=t(3),r=t.n(a),c=t(21),i=t.n(c),o=(t(31),t(25)),l=t(24),s=t(22),u=t.n(s),d=t(11),m=t(13),v=t(12),f=t(18),g=t(17),p=t(2),E=v.actions.assign,b=Object(f.a)({id:"watch",context:{maximum:10,seconds:0},initial:"idle",states:{idle:{on:{START:"started"}},started:{entry:E({seconds:0}),invoke:{id:"tick",src:function(e,n){return function(e,n){var t=setInterval((function(){return e("TICK")}),1e3);return function(){return clearInterval(t)}}}},on:{TICK:[{target:"end",cond:function(e){return e.seconds>=e.maximum}},{target:"",actions:[E({seconds:function(e){return e.seconds+1}}),Object(p.r)("CLOCK_TICK")]}],STOP:"end"}},end:{type:"final",entry:Object(p.r)("CLOCK_END")}}}),C=v.actions.assign,k=v.actions.send;var h=function(){return function(e){for(var n=e.length;n>0;){var t=Math.floor(Math.random()*n),a=e[--n];e[n]=e[t],e[t]=a}return e}(["pomme","banane","pommeVert","fraise","abricot","grenade","citron","citronVert","peche","raisin"].reduce((function(e,n){return e.concat(n,n)}),[])).reduce((function(e,n,t){return Object(m.a)({},e,Object(d.a)({},t,{name:n,id:t}))}),{})},y=Object(f.a)({id:"memory-game",context:{parties:[],cards:h(),lastRevealedCardId:null,revealedCards:{},clock:null,progress:0,username:"",error:""},initial:"idle",states:{idle:{entry:C({cards:h(),revealedCards:{},clock:null,progress:0,username:"",error:"",lastRevealedCardId:null}),invoke:{id:"fetch-parties",src:function(e){return fetch("/parties").then((function(e){return e.json()}))},onDone:"partiesLoaded",onError:"requestFailed"}},requestFailed:{entry:C({error:function(e,n){return"Une triste erreur est survenue !"}}),on:{RETRY:"idle"}},partiesLoaded:{entry:[C({parties:function(e,n){return n.data},clock:function(e,n){return Object(g.c)(b.withContext({maximum:120}),{sync:!0})}})],on:{TYPING:{actions:C({username:function(e,n){return n.username}})},PLAY:{target:"playing",actions:k("START",{to:function(e){return e.clock}})}}},playing:{on:{CLOCK_END:"lost",REVEAL:"revealingFirst"}},revealingFirst:{entry:C({lastRevealedCardId:function(e,n){return n.id},revealedCards:function(e,n){return Object(m.a)({},e.revealedCards,Object(d.a)({},n.id,!0))}}),on:{REVEAL:"revealingSecond"}},revealingSecond:{entry:C({revealedCards:function(e,n){return Object(m.a)({},e.revealedCards,Object(d.a)({},n.id,!0))}}),invoke:{id:"check-revealed-cards",src:function(e,n){return function(t,a){var r=e.cards[e.lastRevealedCardId],c=e.cards[n.id];if(Object.values(e.revealedCards).filter((function(e){return e})).length===Object.keys(e.cards).length)return t("WIN");if(r.name===c.name)return t("MATCH");var i=setTimeout((function(){return t(Object(m.a)({type:"NOT_MATCH"},c))}),650);return function(){return clearTimeout(i)}}}},on:{WIN:{target:"winning",actions:C({progress:100})},MATCH:{target:"playing",actions:C({progress:function(e){return parseInt(100*Object.values(e.revealedCards).filter((function(e){return e})).length/Object.keys(e.cards).length)},lastRevealedCardId:function(){return null}})},NOT_MATCH:{target:"playing",actions:C({lastRevealedCardId:function(e,n){return null},revealedCards:function(e,n){var t;return Object(m.a)({},e.revealedCards,(t={},Object(d.a)(t,e.lastRevealedCardId,!1),Object(d.a)(t,n.id,!1),t))}})}}},winning:{entry:k("STOP",{to:function(e){return e.clock}}),invoke:{id:"save-party",src:function(e){return fetch("/parties",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({username:e.username,seconds:e.clock.state.context.seconds})}).then((function(e){return e.json()}))},onDone:"waitWinning",onError:"requestFailed"}},waitWinning:{after:{1500:"won"}},won:{on:{RETRY:"idle"}},lost:{on:{RETRY:"idle"}}}}),O=t(10),N=function(e){var n=e.back,t=e.flipped,a=e.onClick;return r.a.createElement("div",{className:"flip-card ".concat(t?"flipped":""),onClick:a},r.a.createElement("div",{className:"flip-card-inner"},r.a.createElement("div",{className:"flip-card-front"},r.a.createElement("img",{src:u.a,alt:"Avatar",style:{display:"block",background:"lightgray",width:"100px"}})),r.a.createElement("div",{className:"flip-card-back"},r.a.createElement("div",{className:n}))))},T=function(e){var n=e.parties;return r.a.createElement(r.a.Fragment,null,r.a.createElement("h2",null,"Leaderboard"),r.a.createElement("div",{className:O.leaderboard},n.map((function(e,n){return r.a.createElement("div",{className:O.row,key:n},r.a.createElement("div",{className:O.name},e.username),r.a.createElement("div",{className:O.score},e.seconds))}))))},j=function(e){var n=e.value;return r.a.createElement("div",{style:{background:"#f1f1f1"}},r.a.createElement("div",{style:{color:"white",background:"green",width:n+"%"}},n))},w=function(){var e=Object(l.useMachine)(y),n=Object(o.a)(e,2),t=n[0],a=n[1],c=function(){return null},i=function(){return 0};switch(t.value){case"idle":return r.a.createElement("div",null,"Chargement ...");case"requestFailed":return r.a.createElement("div",null,r.a.createElement("p",null,"Une erreur est survenue ! ",t.context.error));case"partiesLoaded":c=function(){return r.a.createElement("div",{className:O.usernameContainer},r.a.createElement("label",null,"Pseudo :"," ",r.a.createElement("input",{type:"text",value:t.context.username,onChange:function(e){return a("TYPING",{username:e.target.value})},required:!0})),r.a.createElement("br",null),r.a.createElement("button",{className:O.button,onClick:function(){return a("PLAY")}},"Jouer"))};break;case"playing":case"revealingFirst":case"revealingSecond":var s=t.context,u=s.cards,d=s.revealedCards,m=t.context.clock.state.context,v=m.maximum,f=m.seconds;i=function(){return r.a.createElement("span",null,v-f)},c=function(){return r.a.createElement("div",null,r.a.createElement("div",{className:"grid"},Object.values(u).map((function(e,n){return r.a.createElement(N,{key:n,back:"card-"+e.name,flipped:d[e.id],onClick:function(){d[e.id]||a("REVEAL",e)}})}))))};break;case"winning":case"waitWinning":c=function(){return r.a.createElement("div",null,"Winner ! Sauvegarde de la partie en cours ...")};break;case"won":c=function(){return r.a.createElement("div",null,"Well done ! ",r.a.createElement("br",null),r.a.createElement("button",{className:O.button,onClick:function(){return a("RETRY")}},"Recommencer ?"))};break;case"lost":c=function(){return r.a.createElement("div",null,"Times Up! Perdu ... :( ",r.a.createElement("br",null),r.a.createElement("button",{className:O.button,onClick:function(){return a("RETRY")}},"Recommencer ?"))}}return r.a.createElement("div",{className:"game-container"},r.a.createElement("div",{className:"leaderboard"},r.a.createElement(T,{parties:t.context.parties})),r.a.createElement("div",{className:"timer"},r.a.createElement("div",{className:"time"},i()," "),r.a.createElement("div",{className:"progress"},r.a.createElement(j,{value:t.context.progress}))),r.a.createElement("div",{className:"game"},c()))};var R=function(){return r.a.createElement(w,null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(R,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[26,1,2]]]);
//# sourceMappingURL=main.41ff2e74.chunk.js.map