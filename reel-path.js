(function(){'use strict';
// Model units, not survey measurements. One simple closed boundary in the YZ plane.
// A constant X standoff keeps the moving cabin envelope in front of the fixed facade.
const X=-.68, knots=[[5.575,0],[4.95,.625],[4.3,.24],[3.65,.625],[3.025,0],[3.65,-.625],[4.3,-.24],[4.95,-.625]], handles=[[0,.345],[-.345,0],[-.22,0],[-.345,0],[0,-.345],[.345,0],[.22,0],[.345,0]];
const segments=knots.map((p,i)=>{const j=(i+1)%8,q=knots[j];return[p,p.map((v,k)=>v+handles[i][k]),q.map((v,k)=>v-handles[j][k]),q];});
function raw(u){u=((u%1)+1)%1;const s=u*8,i=Math.floor(s),t=s-i,a=1-t,p=segments[i];return[X,...[0,1].map(k=>a*a*a*p[0][k]+3*a*a*t*p[1][k]+3*a*t*t*p[2][k]+t*t*t*p[3][k])];}
function derivative(u){u=((u%1)+1)%1;const s=u*8,i=Math.floor(s),t=s-i,a=1-t,p=segments[i];return[0,...[0,1].map(k=>24*(a*a*(p[1][k]-p[0][k])+2*a*t*(p[2][k]-p[1][k])+t*t*(p[3][k]-p[2][k])))];}
const count=4096,lut=[0];let prev=raw(0),length=0;for(let i=1;i<=count;i++){const p=raw(i/count);length+=Math.hypot(...p.map((v,k)=>v-prev[k]));lut.push(length);prev=p;}
function parameter(t){const target=(((t%1)+1)%1)*length;let lo=0,hi=count;while(hi-lo>1){const m=(lo+hi)>>1;if(lut[m]<target)lo=m;else hi=m;}return(lo+(target-lut[lo])/(lut[hi]-lut[lo]))/count;}
function point(t){return raw(parameter(t));}
function tangent(t){const v=derivative(parameter(t)),n=Math.hypot(...v);return v.map(x=>x/n);}
window.SC_REEL_PATH={point,tangent,raw,derivative,segments,length,planeX:X,waistSeparation:.48,samples:Array.from({length:513},(_,i)=>point(i/512))};
}());
