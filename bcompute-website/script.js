(() => {
 const cfg=window.BCOMPUTE_CONFIG||{}, email=(cfg.contactEmail||"").trim();
 const valid=email&&!email.includes("YOUR-DOMAIN")&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 const link=document.getElementById("email-link"), form=document.getElementById("contact-form"), error=document.getElementById("error");
 document.getElementById("year").textContent=new Date().getFullYear();
 if(valid){link.href=`mailto:${email}`;link.textContent=email;}else{link.href="#contact";link.textContent="Set your contact email in config.js";}
 document.querySelector(".menu").addEventListener("click",()=>document.body.classList.toggle("nav-open"));
 document.querySelectorAll("header nav a").forEach(a=>a.addEventListener("click",()=>document.body.classList.remove("nav-open")));
 form.addEventListener("submit",e=>{e.preventDefault();if(!valid){error.textContent="Please set a valid contactEmail in config.js before publishing.";return;}
 const d=new FormData(form), name=d.get("name"), sender=d.get("email"), company=d.get("company"), message=d.get("message");
 const subject=encodeURIComponent(`bCompute website inquiry — ${company||name}`), body=encodeURIComponent(`Name: ${name}\nWork email: ${sender}\nCompany: ${company||"Not provided"}\n\nWhat they're working on:\n${message||"Not provided"}\n\nPlease reply directly to: ${sender}`);
 location.href=`mailto:${email}?subject=${subject}&body=${body}`;
 });
})();
