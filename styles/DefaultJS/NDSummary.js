/* This file is part of Natural Docs, which is Copyright © 2003-2013 Greg Valure.
 * Natural Docs is licensed under version 3 of the GNU Affero General Public
 * License (AGPL).  Refer to License.txt or www.naturaldocs.org for the
 * complete details.
 *
 * This file may be distributed with documentation files generated by Natural Docs.
 * Such documentation is not covered by Natural Docs' copyright and licensing,
 * and may have its own copyright and distribution terms as decided by its author.
 */

"use strict";var NDSummary=new function(){this.Start=function(){this.toolTipHolder=document.createElement("div");this.toolTipHolder.style.display="none";this.toolTipHolder.style.position="fixed";var ieVersion=NDCore.IEVersion();if(ieVersion!=undefined&&ieVersion==6){this.toolTipHolder.style.position="absolute";}this.toolTipHolder.style.zIndex=21;document.body.appendChild(this.toolTipHolder);};this.OnLocationChange=function(oldLocation,newLocation){this.ResetToolTip();if(oldLocation==undefined||oldLocation.type!=newLocation.type||oldLocation.path!=newLocation.path){this.summaryLanguages=undefined;this.summaryTopicTypes=undefined;this.summaryEntries=undefined;this.summaryToolTips=undefined;if(oldLocation==undefined){this.Build();}else if(this.delayedLoadingTimeout==undefined){this.delayedLoadingTimeout=setTimeout(function(){if(NDSummary.summaryLanguages==undefined){NDSummary.Build();}clearTimeout(NDSummary.delayedLoadingTimout);NDSummary.delayedLoadingTimeout=undefined;}, 250);}var head=document.getElementsByTagName("head")[0];var loader=document.getElementById("NDSummaryLoader");if(loader){head.removeChild(loader);}loader=document.getElementById("NDSummaryToolTipsLoader");if(loader){head.removeChild(loader);}NDCore.LoadJavaScript(newLocation.summaryFile,"NDSummaryLoader");}this.FinishIENavigation();};this.OnSummaryLoaded=function(hashPath,summaryLanguages,summaryTopicTypes,summaryEntries){if(hashPath==NDFramePage.currentLocation.path){this.summaryLanguages=summaryLanguages;this.summaryTopicTypes=summaryTopicTypes;this.summaryEntries=summaryEntries;this.Build();this.FinishIENavigation();NDCore.LoadJavaScript(NDFramePage.currentLocation.summaryTTFile,"NDSummaryToolTipsLoader");}};this.OnToolTipsLoaded=function(hashPath,summaryToolTips){if(hashPath==NDFramePage.currentLocation.path){this.summaryToolTips=summaryToolTips;if(this.showingToolTip!=undefined&&summaryToolTips[this.showingToolTip]!=undefined){this.ShowToolTip();}}};this.Build=function(){var newContent=document.createElement("div");newContent.id="SuContent";if(this.summaryEntries==undefined){var loadingNotice=document.createElement("div");loadingNotice.className="SuLoadingNotice";newContent.appendChild(loadingNotice);}else{var mouseOverHandler=function(e){NDSummary.OnEntryMouseOver(e);};var mouseOutHandler=function(e){NDSummary.OnEntryMouseOut(e);};for(var i=0;i<this.summaryEntries.length;i++){var entry=this.summaryEntries[i];if(entry[3]!=undefined){var entryHTML=document.createElement("a");var classString="SuEntry"+" L"+this.summaryLanguages[entry[1]][1]+" T"+this.summaryTopicTypes[entry[2]][1]+(i==0?" first":"")+(i==this.summaryEntries.length-1?" last":"");var href="#"+NDFramePage.currentLocation.path+(entry[4]!=undefined?":"+entry[4]:"");entryHTML.id="SuEntry"+entry[0];entryHTML.className=classString;entryHTML.setAttribute("href",href);entryHTML.innerHTML="<div class=\"SuEntryIcon\"></div>"+entry[3];entryHTML.onmouseover=mouseOverHandler;entryHTML.onmouseout=mouseOutHandler;var entryHTMLChild=entryHTML.firstChild;if(entryHTMLChild!=undefined&&NDCore.HasClass(entryHTMLChild,"Qualifier")){entryHTMLChild.onmouseover=mouseOverHandler;entryHTMLChild.onmouseout=mouseOutHandler;}newContent.appendChild(entryHTML);}}}var summaryContainer=document.getElementById("NDSummary");var oldContent=document.getElementById("SuContent");if(oldContent!=undefined){summaryContainer.replaceChild(newContent,oldContent);}else{summaryContainer.appendChild(newContent);}newContent.scrollIntoView(true);if(this.summaryEntries!=undefined){NDFramePage.SizeSummaryToContent();}if(NDCore.IsIE()&&NDCore.IEVersion()==10){setTimeout(function(){document.getElementById("NDSummary").style.zoom="100%";},0);}};this.FinishIENavigation=function(){if(NDCore.IsIE()&&this.summaryEntries!=undefined&&NDFramePage.currentLocation!=undefined&&NDFramePage.currentLocation.type=="File"&&NDFramePage.currentLocation.member!=undefined){var topicID=-1;for(var i=0;i<this.summaryEntries.length;i++){if(this.summaryEntries[i][4]==NDFramePage.currentLocation.member){topicID=this.summaryEntries[i][0];break;}}var frame=document.getElementById("CFrame");var targetLocation=NDFramePage.currentLocation.contentPage;var hashIndex=targetLocation.indexOf('#');if(hashIndex!=-1){targetLocation=targetLocation.substr(0,hashIndex);}if(topicID!=-1){targetLocation+="#Topic"+topicID;}frame.contentWindow.location=targetLocation;frame.contentWindow.focus();}};this.OnEntryMouseOver=function(event){if(event==undefined){event=window.event;}var entry=event.target||event.srcElement;if(NDCore.HasClass(entry,"Qualifier")){entry=entry.parentNode;}var id=this.GetTopicIDFromDOMID(entry.id);if(this.showingToolTip!=id){this.ResetToolTip();this.showingToolTip=id;if(this.summaryToolTips==undefined){}else if(this.summaryToolTips[id]!=undefined){if(id==this.lastToolTip){this.ShowToolTip();}else{this.toolTipTimeout=setTimeout(function(){clearTimeout(this.toolTipTimeout);this.toolTipTimeout=undefined;NDSummary.ShowToolTip();}, 350);}}}};this.OnEntryMouseOut=function(event){if(event==undefined){event=window.event;}var entry=event.target||event.srcElement;if(NDCore.HasClass(entry,"Qualifier")){entry=entry.parentNode;}var id=this.GetTopicIDFromDOMID(entry.id);if(this.showingToolTip==id){this.ResetToolTip();}};this.GetTopicIDFromDOMID=function(domID){var id=parseInt(domID.substr(7),10);if(id!=NaN&&id>0){return id;}else{return-1;}};this.ShowToolTip=function(){var entry=document.getElementById("SuEntry"+this.showingToolTip);this.toolTipHolder.innerHTML=this.summaryToolTips[this.showingToolTip];this.toolTipHolder.style.visibility="hidden";this.toolTipHolder.style.display="block";var summaryBlock=document.getElementById("NDSummary");var x=summaryBlock.offsetLeft+entry.offsetLeft+entry.offsetWidth;var y=summaryBlock.offsetTop+entry.offsetTop-summaryBlock.scrollTop;var newWidth=undefined;var maxWidth=NDCore.WindowClientWidth()-x;if(this.toolTipHolder.offsetWidth>maxWidth){newWidth=maxWidth;}NDCore.SetToAbsolutePosition(this.toolTipHolder,x,y,newWidth,undefined);var prototypes=NDCore.GetElementsByClassName(this.toolTipHolder,"NDPrototype","div");if(prototypes.length>0&&NDCore.HasClass(prototypes[0],"WideForm")&&prototypes[0].scrollWidth>prototypes[0].offsetWidth){NDCore.ChangePrototypeToNarrowForm(prototypes[0]);}var footer=document.getElementById("NDFooter");if(y+this.toolTipHolder.offsetHeight+(footer.offsetHeight*2)>NDCore.WindowClientHeight()){var newY=NDCore.WindowClientHeight()-this.toolTipHolder.offsetHeight-(footer.offsetHeight*2);if(newY<0){newY=0;}NDCore.SetToAbsolutePosition(this.toolTipHolder,undefined,newY,undefined,undefined);}this.toolTipHolder.style.visibility="visible";};this.ResetToolTip=function(){if(this.showingToolTip!=undefined){this.toolTipHolder.style.display="none";this.toolTipHolder.style.width=null;this.lastToolTip=this.showingToolTip;this.showingToolTip=undefined;}if(this.toolTipTimeout!=undefined){clearTimeout(this.toolTipTimeout);this.toolTipTimeout=undefined;}};};