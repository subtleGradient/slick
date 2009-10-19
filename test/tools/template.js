// window.top.$$$ = function(selector, context, isXML){
// 	context = context || document;
// 	var o = {};
// 	try{ o.QSA = context.querySelectorAll(selector).length }catch(e){}
// 	try{ o.Slick = Slick(context,selector).length }catch(e){}
// 	try{ o.Sizzle = Sizzle(selector, context).length }catch(e){}
// 	try{ o.Sly = Sly(selector, context).length }catch(e){}
// 	try{ o.Acme = acme.query(selector, context).length }catch(e){}
// 	return o;
// }
// 
// window.top.Slick = window.Slick;
// window.top.document.search = window.document.search;
// 
// window.onload = window.top.context_onload;
