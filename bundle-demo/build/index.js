function W(x){const B=Object.prototype.toString.call(x);if(x instanceof Date||typeof x==="object"&&B==="[object Date]")return new x.constructor(+x);else if(typeof x==="number"||B==="[object Number]"||typeof x==="string"||B==="[object String]")return new Date(x);else return new Date(NaN)}var g=Math.pow(10,8)*24*60*60*1000,w0=-g;var w=43200,k=1440;function P(){return m}var m={};function S(x){const B=W(x),J=new Date(Date.UTC(B.getFullYear(),B.getMonth(),B.getDate(),B.getHours(),B.getMinutes(),B.getSeconds(),B.getMilliseconds()));return J.setUTCFullYear(B.getFullYear()),+x-+J}function q(x,B){const J=W(x),G=W(B),C=J.getTime()-G.getTime();if(C<0)return-1;else if(C>0)return 1;else return C}function F(x,B){const J=W(x),G=W(B),C=J.getFullYear()-G.getFullYear(),Z=J.getMonth()-G.getMonth();return C*12+Z}function z(x){return(B)=>{const G=(x?Math[x]:Math.trunc)(B);return G===0?0:G}}function j(x,B){return+W(x)-+W(B)}function M(x){const B=W(x);return B.setHours(23,59,59,999),B}function y(x){const B=W(x),J=B.getMonth();return B.setFullYear(B.getFullYear(),J+1,0),B.setHours(23,59,59,999),B}function R(x){const B=W(x);return+M(B)===+y(B)}function O(x,B){const J=W(x),G=W(B),C=q(J,G),Z=Math.abs(F(J,G));let X;if(Z<1)X=0;else{if(J.getMonth()===1&&J.getDate()>27)J.setDate(30);J.setMonth(J.getMonth()-C*Z);let H=q(J,G)===-C;if(R(W(x))&&Z===1&&q(x,G)===1)H=!1;X=C*(Z-Number(H))}return X===0?0:X}function _(x,B,J){const G=j(x,B)/1000;return z(J?.roundingMethod)(G)}var l={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},b=(x,B,J)=>{let G;const C=l[x];if(typeof C==="string")G=C;else if(B===1)G=C.one;else G=C.other.replace("{{count}}",B.toString());if(J?.addSuffix)if(J.comparison&&J.comparison>0)return"in "+G;else return G+" ago";return G};function V(x){return(B={})=>{const J=B.width?String(B.width):x.defaultWidth;return x.formats[J]||x.formats[x.defaultWidth]}}var d={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},r={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},i={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},D={date:V({formats:d,defaultWidth:"full"}),time:V({formats:r,defaultWidth:"full"}),dateTime:V({formats:i,defaultWidth:"full"})};var n={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},L=(x,B,J,G)=>n[x];function N(x){return(B,J)=>{const G=J?.context?String(J.context):"standalone";let C;if(G==="formatting"&&x.formattingValues){const X=x.defaultFormattingWidth||x.defaultWidth,H=J?.width?String(J.width):X;C=x.formattingValues[H]||x.formattingValues[X]}else{const X=x.defaultWidth,H=J?.width?String(J.width):x.defaultWidth;C=x.values[H]||x.values[X]}const Z=x.argumentCallback?x.argumentCallback(B):B;return C[Z]}}var o={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},s={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},a={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},e={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},t={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},x0={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},B0=(x,B)=>{const J=Number(x),G=J%100;if(G>20||G<10)switch(G%10){case 1:return J+"st";case 2:return J+"nd";case 3:return J+"rd"}return J+"th"},p={ordinalNumber:B0,era:N({values:o,defaultWidth:"wide"}),quarter:N({values:s,defaultWidth:"wide",argumentCallback:(x)=>x-1}),month:N({values:a,defaultWidth:"wide"}),day:N({values:e,defaultWidth:"wide"}),dayPeriod:N({values:t,defaultWidth:"wide",formattingValues:x0,defaultFormattingWidth:"wide"})};function U(x){return(B,J={})=>{const G=J.width,C=G&&x.matchPatterns[G]||x.matchPatterns[x.defaultMatchWidth],Z=B.match(C);if(!Z)return null;const X=Z[0],H=G&&x.parsePatterns[G]||x.parsePatterns[x.defaultParseWidth],T=Array.isArray(H)?C0(H,(A)=>A.test(X)):J0(H,(A)=>A.test(X));let K;K=x.valueCallback?x.valueCallback(T):T,K=J.valueCallback?J.valueCallback(K):K;const E=B.slice(X.length);return{value:K,rest:E}}}var J0=function(x,B){for(let J in x)if(Object.prototype.hasOwnProperty.call(x,J)&&B(x[J]))return J;return},C0=function(x,B){for(let J=0;J<x.length;J++)if(B(x[J]))return J;return};function h(x){return(B,J={})=>{const G=B.match(x.matchPattern);if(!G)return null;const C=G[0],Z=B.match(x.parsePattern);if(!Z)return null;let X=x.valueCallback?x.valueCallback(Z[0]):Z[0];X=J.valueCallback?J.valueCallback(X):X;const H=B.slice(C.length);return{value:X,rest:H}}}var G0=/^(\d+)(th|st|nd|rd)?/i,H0=/\d+/i,W0={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},X0={any:[/^b/i,/^(a|c)/i]},Z0={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},$0={any:[/1/i,/2/i,/3/i,/4/i]},K0={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},T0={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},E0={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},Q0={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},Y0={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},q0={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},f={ordinalNumber:h({matchPattern:G0,parsePattern:H0,valueCallback:(x)=>parseInt(x,10)}),era:U({matchPatterns:W0,defaultMatchWidth:"wide",parsePatterns:X0,defaultParseWidth:"any"}),quarter:U({matchPatterns:Z0,defaultMatchWidth:"wide",parsePatterns:$0,defaultParseWidth:"any",valueCallback:(x)=>x+1}),month:U({matchPatterns:K0,defaultMatchWidth:"wide",parsePatterns:T0,defaultParseWidth:"any"}),day:U({matchPatterns:E0,defaultMatchWidth:"wide",parsePatterns:Q0,defaultParseWidth:"any"}),dayPeriod:U({matchPatterns:Y0,defaultMatchWidth:"any",parsePatterns:q0,defaultParseWidth:"any"})};var v={code:"en-US",formatDistance:b,formatLong:D,formatRelative:L,localize:p,match:f,options:{weekStartsOn:0,firstWeekContainsDate:1}};function u(x,B,J){const G=P(),C=J?.locale??G.locale??v,X=q(x,B);if(isNaN(X))throw new RangeError("Invalid time value");const H=Object.assign({},J,{addSuffix:J?.addSuffix,comparison:X});let T,K;if(X>0)T=W(B),K=W(x);else T=W(x),K=W(B);const E=_(K,T),A=(S(K)-S(T))/1000,$=Math.round((E-A)/60);let Y;if($<2)if(J?.includeSeconds)if(E<5)return C.formatDistance("lessThanXSeconds",5,H);else if(E<10)return C.formatDistance("lessThanXSeconds",10,H);else if(E<20)return C.formatDistance("lessThanXSeconds",20,H);else if(E<40)return C.formatDistance("halfAMinute",0,H);else if(E<60)return C.formatDistance("lessThanXMinutes",1,H);else return C.formatDistance("xMinutes",1,H);else if($===0)return C.formatDistance("lessThanXMinutes",1,H);else return C.formatDistance("xMinutes",$,H);else if($<45)return C.formatDistance("xMinutes",$,H);else if($<90)return C.formatDistance("aboutXHours",1,H);else if($<k){const Q=Math.round($/60);return C.formatDistance("aboutXHours",Q,H)}else if($<2520)return C.formatDistance("xDays",1,H);else if($<w){const Q=Math.round($/k);return C.formatDistance("xDays",Q,H)}else if($<w*2)return Y=Math.round($/w),C.formatDistance("aboutXMonths",Y,H);if(Y=O(K,T),Y<12){const Q=Math.round($/w);return C.formatDistance("xMonths",Q,H)}else{const Q=Y%12,I=Math.trunc(Y/12);if(Q<3)return C.formatDistance("aboutXYears",I,H);else if(Q<9)return C.formatDistance("overXYears",I,H);else return C.formatDistance("almostXYears",I+1,H)}}var c=new Date,N0=new Date(c.getFullYear(),3,16),U0=u(c,N0);console.log(U0,"until your birthday");
