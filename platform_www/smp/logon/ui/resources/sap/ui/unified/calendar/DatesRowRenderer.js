/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','sap/ui/unified/calendar/CalendarUtils','sap/ui/core/date/UniversalDate','./MonthRenderer'],function(q,R,C,U,M){"use strict";var D=R.extend(M);D.getStartDate=function(d){return d._getStartDate();};D.getClass=function(){return"sapUiCalDatesRow sapUiCalRow";};D.renderHeader=function(r,d,o){var l=d._getLocaleData();var i=d.getId();var a=d.getDays();var w="";if(d._getShowHeader()){r.write("<div id=\""+i+"-Head\">");this.renderHeaderLine(r,d,l,o);r.write("</div>");}w=(100/a)+"%";r.write("<div id=\""+i+"-Names\" style=\"display: inline;\">");this.renderDayNames(r,d,l,o.getUTCDay(),a,false,w);r.write("</div>");};D.renderHeaderLine=function(r,d,l,o){var I=d.getId();var a=d.getDays();var b=new U(o.getTime());var w="";var m=0;var c=[];var i=0;for(i=0;i<a;i++){m=b.getUTCMonth();if(c.length>0&&c[c.length-1].iMonth==m){c[c.length-1].iDays++;}else{c.push({iMonth:m,iDays:1});}b.setUTCDate(b.getUTCDate()+1);}var e=l.getMonthsStandAlone("wide");for(i=0;i<c.length;i++){var f=c[i];w=(100/a*f.iDays)+"%";r.write("<div id=\""+I+"-Head"+i+"\"class=\"sapUiCalHeadText\" style=\"width:"+w+"\">");r.write(e[f.iMonth]);r.write("</div>");}};D.renderDays=function(r,d,o){var a=d.getDays();var w=(100/a)+"%";if(!o){o=d._getFocusedDate();}var h=this.getDayHelper(d,o);var b=new U(o.getTime());for(var i=0;i<a;i++){this.renderDay(r,d,b,h,false,false,i,w);b.setUTCDate(b.getUTCDate()+1);}};return D;},true);
