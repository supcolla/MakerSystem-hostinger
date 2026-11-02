/* Calculadora da revenda: 60% do valor que o cliente paga, todo mês. Contas em centavos. */
(() => {
 const calc=document.getElementById('calc');
 if(!calc)return;
 const MIN=1,MAX=300,PCT=60;
 const range=calc.querySelector('#calc-range'),num=calc.querySelector('#calc-num'),fiscal=calc.querySelector('#calc-fiscal'),link=calc.querySelector('#calc-zap');
 const out=k=>calc.querySelector('[data-out="'+k+'"]');
 const brl=c=>(c/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 function atualizar(origem){
  let n=parseInt(origem==='num'?num.value:range.value,10);
  if(Number.isNaN(n)){if(origem==='num')return;n=MIN;}
  n=Math.min(MAX,Math.max(MIN,n));
  range.value=n;
  if(origem!=='num'||String(n)!==num.value)num.value=n;
  range.style.setProperty('--p',((n-MIN)/(MAX-MIN)*100)+'%');
  const plano=calc.querySelector('input[name="plano"]:checked');
  const paga=Number(plano.value)+(fiscal.checked?Number(fiscal.value):0);
  const porCliente=Math.round(paga*PCT/100);
  const mes=porCliente*n;
  out('mes').textContent=brl(mes);
  out('ano').textContent=brl(mes*12);
  out('cliente').textContent=brl(porCliente);
  const msg='Olá! Quero ser revendedor do VENDE+. Simulei '+n+(n===1?' cliente':' clientes')+', '+brl(mes)+' por mês.\nOrigem: revenda-calculadora';
  link.href='https://wa.me/5561999032545?text='+encodeURIComponent(msg);
 }
 range.addEventListener('input',()=>atualizar('range'));
 num.addEventListener('input',()=>atualizar('num'));
 num.addEventListener('blur',()=>atualizar('range'));
 calc.querySelectorAll('input[name="plano"]').forEach(r=>r.addEventListener('change',()=>atualizar('range')));
 fiscal.addEventListener('change',()=>atualizar('range'));
 atualizar('range');
})();
