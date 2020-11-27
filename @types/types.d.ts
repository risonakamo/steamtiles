// object containing a tile and the extracted date as a luxon date
interface DatedTile
{
    tile:HTMLLinkElement
    date:DateTime|null //null if invalid
}