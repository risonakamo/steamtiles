import {DateTime} from "luxon";

import "./steamtile.less";

var _stallObserver:boolean=false;

function main()
{
    document.head.insertAdjacentHTML("beforeend",
        `<link rel="stylesheet" href="${chrome.runtime.getURL("build/steamtile-build.css")}">`);

    var observer:MutationObserver=new MutationObserver(()=>{
        if (_stallObserver)
        {
            _stallObserver=false;
            return;
        }

        replaceImages();
        removeDateHeaders();
        insertDateHeaders();
    });

    observer.observe(document.querySelector("#search_resultsRows")!,{
        childList:true
    });

    replaceImages();
    removeDateHeaders();
    insertDateHeaders();
}

// target all images on page and replaces with higher res images
function replaceImages():void
{
    var searchrows:NodeListOf<HTMLLinkElement>=document.querySelectorAll(".search_result_row");

    var rowImageElement:HTMLImageElement;
    var extractedId:string;
    for (var x=0,l=searchrows.length;x<l;x++)
    {
        rowImageElement=searchrows[x].firstElementChild!.firstElementChild as HTMLImageElement;
        extractedId=searchrows[x].href.replace(/.*\/(\d+)\/.*/,"$1");

        rowImageElement.src=`https://steamcdn-a.akamaihd.net/steam/apps/${extractedId}/header.jpg`;
        rowImageElement.srcset=rowImageElement.src;
    }
}

// target all tile elements and append day headers for each day
function insertDateHeaders():void
{
    var tileElements:HTMLLinkElement[]=Array.from(document.querySelectorAll(".search_result_row"));

    var tiles:DatedTile[]=tileElements.map((x:HTMLLinkElement)=>{
        return {
            tile:x,
            date:resolveDate((x.querySelector(".search_released")! as HTMLElement).innerText)
        };
    });

    // filter out tiles with invalid dates
    tiles=tiles.filter((x:DatedTile)=>{
        return x.date && x.date.isValid;
    });

    // reject all tiles where the previous date is the same as the current tile's date.
    tiles=tiles.filter((x:DatedTile,i:number)=>{
        // always take first tile
        if (i==0)
        {
            return true;
        }

        return !(x.date?.equals(tiles[i-1].date!));
    });

    for (var x=0,l=tiles.length;x<l;x++)
    {
        insertHeader(tiles[x]);
    }
}

// given the date string of a tile, which is in a special format, attempt to create a DateTime from that string.
// if the string is invalid, or should be considered invalid, returns null.
function resolveDate(dateString:string):DateTime|null
{
    if (!/.* \d+, \d+/.test(dateString))
    {
        return null;
    }

    return DateTime.fromJSDate(new Date(dateString));
}

// insert a date header given a target dated tile.
function insertHeader(targetTile:DatedTile):void
{
    _stallObserver=true;
    var datetext:string=targetTile.date!.toFormat("yyyy LLL dd");
    targetTile.tile.insertAdjacentHTML("beforebegin",`<h1 class="day-header">${datetext}</h1>`);
}

// target and remove all date header elements
function removeDateHeaders():void
{
    _stallObserver=true;
    var dateHeaders:NodeListOf<HTMLElement>=document.querySelectorAll(".day-header");

    for (var x=0,l=dateHeaders.length;x<l;x++)
    {
        dateHeaders[x].remove();
    }
}

main();