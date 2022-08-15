export interface Tile{
  name:string,
  link:string,
  maxZoom:number,
  subdomains?: string[],
}
export const tiles:Tile[]=[
  {
    name:'Streets',
    link:'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom:20,
    subdomains: ['mt0','mt1','mt2','mt3'],
  },
  {
    name:'Hybrid',
    link:'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']

  },
  {
    name:'Satellite',
    link:'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  },
  {
  name:'Terrain',
  link:'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
  },
  {
    name:'openstreetmap',
    link:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
  }
]
