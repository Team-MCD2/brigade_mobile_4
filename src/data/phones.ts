export interface PhoneModel {
  id: string;
  name: string;
  brand: string;
  image?: string;
  capacities: string[];
  colors: string[];
  /** Prix neuf de référence en euros */
  marketPrice: Record<string, number>;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  models: PhoneModel[];
}

const m = (id:string,name:string,brand:string,caps:string[],colors:string[],prices:Record<string,number>):PhoneModel=>({id,name,brand,capacities:caps,colors,marketPrice:prices});

export const brands: Brand[] = [
  {
    id: 'apple', name: 'Apple', logo: '',
    models: [
      m('iphone-16-pro-max','iPhone 16 Pro Max','Apple',['256 Go','512 Go','1 To'],['Titane naturel','Titane blanc','Titane noir','Titane sable'],{'256 Go':1479,'512 Go':1729,'1 To':1979}),
      m('iphone-16-pro','iPhone 16 Pro','Apple',['128 Go','256 Go','512 Go','1 To'],['Titane naturel','Titane blanc','Titane noir','Titane sable'],{'128 Go':1199,'256 Go':1329,'512 Go':1579,'1 To':1829}),
      m('iphone-16-plus','iPhone 16 Plus','Apple',['128 Go','256 Go','512 Go'],['Noir','Blanc','Rose','Sarcelle','Outremer'],{'128 Go':1119,'256 Go':1249,'512 Go':1499}),
      m('iphone-16','iPhone 16','Apple',['128 Go','256 Go','512 Go'],['Noir','Blanc','Rose','Sarcelle','Outremer'],{'128 Go':969,'256 Go':1099,'512 Go':1349}),
      m('iphone-16e','iPhone 16e','Apple',['128 Go','256 Go'],['Noir','Blanc','Rose'],{'128 Go':699,'256 Go':819}),
      m('iphone-15-pro-max','iPhone 15 Pro Max','Apple',['256 Go','512 Go','1 To'],['Titane naturel','Titane bleu','Titane blanc','Titane noir'],{'256 Go':1479,'512 Go':1729,'1 To':1979}),
      m('iphone-15-pro','iPhone 15 Pro','Apple',['128 Go','256 Go','512 Go','1 To'],['Titane naturel','Titane bleu','Titane blanc','Titane noir'],{'128 Go':1199,'256 Go':1329,'512 Go':1579,'1 To':1829}),
      m('iphone-15-plus','iPhone 15 Plus','Apple',['128 Go','256 Go','512 Go'],['Noir','Bleu','Vert','Jaune','Rose'],{'128 Go':1069,'256 Go':1199,'512 Go':1449}),
      m('iphone-15','iPhone 15','Apple',['128 Go','256 Go','512 Go'],['Noir','Bleu','Vert','Jaune','Rose'],{'128 Go':969,'256 Go':1099,'512 Go':1349}),
      m('iphone-14-pro-max','iPhone 14 Pro Max','Apple',['128 Go','256 Go','512 Go','1 To'],['Noir sidéral','Argent','Or','Violet intense'],{'128 Go':1099,'256 Go':1229,'512 Go':1479,'1 To':1729}),
      m('iphone-14-pro','iPhone 14 Pro','Apple',['128 Go','256 Go','512 Go','1 To'],['Noir sidéral','Argent','Or','Violet intense'],{'128 Go':979,'256 Go':1109,'512 Go':1359,'1 To':1609}),
      m('iphone-14-plus','iPhone 14 Plus','Apple',['128 Go','256 Go','512 Go'],['Minuit','Lumière stellaire','Bleu','Violet','Rouge'],{'128 Go':869,'256 Go':999,'512 Go':1249}),
      m('iphone-14','iPhone 14','Apple',['128 Go','256 Go','512 Go'],['Minuit','Lumière stellaire','Bleu','Violet','Rouge'],{'128 Go':769,'256 Go':899,'512 Go':1149}),
      m('iphone-13-pro-max','iPhone 13 Pro Max','Apple',['128 Go','256 Go','512 Go','1 To'],['Graphite','Or','Argent','Bleu alpin'],{'128 Go':949,'256 Go':1079,'512 Go':1329,'1 To':1579}),
      m('iphone-13-pro','iPhone 13 Pro','Apple',['128 Go','256 Go','512 Go','1 To'],['Graphite','Or','Argent','Bleu alpin'],{'128 Go':849,'256 Go':979,'512 Go':1229,'1 To':1479}),
      m('iphone-13','iPhone 13','Apple',['128 Go','256 Go','512 Go'],['Minuit','Lumière stellaire','Bleu','Rose','Vert'],{'128 Go':649,'256 Go':769,'512 Go':999}),
      m('iphone-13-mini','iPhone 13 Mini','Apple',['128 Go','256 Go','512 Go'],['Minuit','Lumière stellaire','Bleu','Rose','Vert'],{'128 Go':579,'256 Go':699,'512 Go':929}),
      m('iphone-12-pro-max','iPhone 12 Pro Max','Apple',['128 Go','256 Go','512 Go'],['Graphite','Or','Argent','Bleu pacifique'],{'128 Go':749,'256 Go':869,'512 Go':1099}),
      m('iphone-12-pro','iPhone 12 Pro','Apple',['128 Go','256 Go','512 Go'],['Graphite','Or','Argent','Bleu pacifique'],{'128 Go':649,'256 Go':769,'512 Go':999}),
      m('iphone-12','iPhone 12','Apple',['64 Go','128 Go','256 Go'],['Noir','Blanc','Bleu','Vert','Rouge'],{'64 Go':489,'128 Go':539,'256 Go':659}),
      m('iphone-12-mini','iPhone 12 Mini','Apple',['64 Go','128 Go','256 Go'],['Noir','Blanc','Bleu','Vert','Rouge'],{'64 Go':429,'128 Go':479,'256 Go':599}),
      m('iphone-11-pro-max','iPhone 11 Pro Max','Apple',['64 Go','256 Go','512 Go'],['Gris sidéral','Argent','Or','Vert nuit'],{'64 Go':549,'256 Go':699,'512 Go':849}),
      m('iphone-11-pro','iPhone 11 Pro','Apple',['64 Go','256 Go','512 Go'],['Gris sidéral','Argent','Or','Vert nuit'],{'64 Go':479,'256 Go':629,'512 Go':779}),
      m('iphone-11','iPhone 11','Apple',['64 Go','128 Go','256 Go'],['Noir','Blanc','Rouge','Jaune','Vert','Mauve'],{'64 Go':349,'128 Go':399,'256 Go':479}),
      m('iphone-se-2022','iPhone SE (2022)','Apple',['64 Go','128 Go','256 Go'],['Minuit','Lumière stellaire','Rouge'],{'64 Go':329,'128 Go':379,'256 Go':459}),
      m('iphone-se-2020','iPhone SE (2020)','Apple',['64 Go','128 Go','256 Go'],['Noir','Blanc','Rouge'],{'64 Go':249,'128 Go':299,'256 Go':379}),
      m('iphone-xr','iPhone XR','Apple',['64 Go','128 Go','256 Go'],['Noir','Blanc','Bleu','Jaune','Corail','Rouge'],{'64 Go':219,'128 Go':269,'256 Go':349}),
      m('iphone-xs-max','iPhone XS Max','Apple',['64 Go','256 Go','512 Go'],['Or','Argent','Gris sidéral'],{'64 Go':279,'256 Go':369,'512 Go':459}),
      m('iphone-xs','iPhone XS','Apple',['64 Go','256 Go','512 Go'],['Or','Argent','Gris sidéral'],{'64 Go':229,'256 Go':319,'512 Go':409}),
      m('iphone-x','iPhone X','Apple',['64 Go','256 Go'],['Argent','Gris sidéral'],{'64 Go':189,'256 Go':259}),
    ],
  },
  {
    id: 'samsung', name: 'Samsung', logo: '',
    models: [
      m('galaxy-s25-ultra','Galaxy S25 Ultra','Samsung',['256 Go','512 Go','1 To'],['Titane noir','Titane gris','Titane bleu','Titane argent'],{'256 Go':1469,'512 Go':1589,'1 To':1829}),
      m('galaxy-s25-plus','Galaxy S25+','Samsung',['256 Go','512 Go'],['Bleu glacé','Gris','Vert','Rose'],{'256 Go':1169,'512 Go':1289}),
      m('galaxy-s25','Galaxy S25','Samsung',['128 Go','256 Go'],['Bleu glacé','Gris','Vert','Rose'],{'128 Go':899,'256 Go':959}),
      m('galaxy-s24-ultra','Galaxy S24 Ultra','Samsung',['256 Go','512 Go','1 To'],['Gris titane','Noir titane','Violet titane','Jaune titane'],{'256 Go':1469,'512 Go':1589,'1 To':1829}),
      m('galaxy-s24-plus','Galaxy S24+','Samsung',['256 Go','512 Go'],['Noir','Gris','Violet','Jaune'],{'256 Go':1169,'512 Go':1289}),
      m('galaxy-s24','Galaxy S24','Samsung',['128 Go','256 Go'],['Noir','Gris','Violet','Jaune'],{'128 Go':899,'256 Go':959}),
      m('galaxy-s24-fe','Galaxy S24 FE','Samsung',['128 Go','256 Go'],['Graphite','Bleu','Vert','Jaune'],{'128 Go':749,'256 Go':809}),
      m('galaxy-s23-ultra','Galaxy S23 Ultra','Samsung',['256 Go','512 Go','1 To'],['Noir fantôme','Crème','Vert','Lavande'],{'256 Go':1099,'512 Go':1219,'1 To':1459}),
      m('galaxy-s23-plus','Galaxy S23+','Samsung',['256 Go','512 Go'],['Noir fantôme','Crème','Vert','Lavande'],{'256 Go':899,'512 Go':1019}),
      m('galaxy-s23','Galaxy S23','Samsung',['128 Go','256 Go'],['Noir fantôme','Crème','Vert','Lavande'],{'128 Go':649,'256 Go':709}),
      m('galaxy-s23-fe','Galaxy S23 FE','Samsung',['128 Go','256 Go'],['Graphite','Crème','Violet','Menthe'],{'128 Go':549,'256 Go':609}),
      m('galaxy-s22-ultra','Galaxy S22 Ultra','Samsung',['128 Go','256 Go','512 Go'],['Noir fantôme','Blanc','Bourgogne','Vert'],{'128 Go':849,'256 Go':949,'512 Go':1099}),
      m('galaxy-s22','Galaxy S22','Samsung',['128 Go','256 Go'],['Noir fantôme','Blanc','Vert','Or rose'],{'128 Go':479,'256 Go':529}),
      m('galaxy-s21-ultra','Galaxy S21 Ultra','Samsung',['128 Go','256 Go','512 Go'],['Noir fantôme','Argent fantôme'],{'128 Go':649,'256 Go':749,'512 Go':899}),
      m('galaxy-s21','Galaxy S21','Samsung',['128 Go','256 Go'],['Gris fantôme','Blanc','Violet','Rose'],{'128 Go':379,'256 Go':429}),
      m('galaxy-z-fold6','Galaxy Z Fold6','Samsung',['256 Go','512 Go','1 To'],['Bleu marine','Rose','Argent'],{'256 Go':1999,'512 Go':2119,'1 To':2259}),
      m('galaxy-z-fold5','Galaxy Z Fold5','Samsung',['256 Go','512 Go','1 To'],['Noir fantôme','Crème','Bleu glacé'],{'256 Go':1899,'512 Go':2019,'1 To':2159}),
      m('galaxy-z-flip6','Galaxy Z Flip6','Samsung',['256 Go','512 Go'],['Bleu','Menthe','Argent','Jaune'],{'256 Go':1199,'512 Go':1319}),
      m('galaxy-z-flip5','Galaxy Z Flip5','Samsung',['256 Go','512 Go'],['Graphite','Crème','Lavande','Menthe'],{'256 Go':1099,'512 Go':1219}),
      m('galaxy-a55','Galaxy A55 5G','Samsung',['128 Go','256 Go'],['Bleu glacé','Lilas','Bleu marine','Jaune'],{'128 Go':399,'256 Go':459}),
      m('galaxy-a54','Galaxy A54 5G','Samsung',['128 Go','256 Go'],['Noir','Blanc','Vert','Violet'],{'128 Go':349,'256 Go':409}),
      m('galaxy-a35','Galaxy A35 5G','Samsung',['128 Go','256 Go'],['Bleu glacé','Lilas','Bleu marine','Jaune'],{'128 Go':329,'256 Go':389}),
      m('galaxy-a25','Galaxy A25 5G','Samsung',['128 Go','256 Go'],['Bleu','Noir','Jaune'],{'128 Go':269,'256 Go':319}),
      m('galaxy-a15','Galaxy A15','Samsung',['128 Go','256 Go'],['Bleu','Noir','Jaune'],{'128 Go':189,'256 Go':229}),
    ],
  },
  {
    id: 'google', name: 'Google', logo: '',
    models: [
      m('pixel-9-pro-xl','Pixel 9 Pro XL','Google',['128 Go','256 Go','512 Go','1 To'],['Obsidienne','Porcelaine','Noisette','Rose'],{'128 Go':1179,'256 Go':1299,'512 Go':1419,'1 To':1539}),
      m('pixel-9-pro','Pixel 9 Pro','Google',['128 Go','256 Go','512 Go'],['Obsidienne','Porcelaine','Noisette','Rose'],{'128 Go':1099,'256 Go':1219,'512 Go':1339}),
      m('pixel-9','Pixel 9','Google',['128 Go','256 Go'],['Obsidienne','Porcelaine','Vert sauge','Rose pivoine'],{'128 Go':899,'256 Go':999}),
      m('pixel-8-pro','Pixel 8 Pro','Google',['128 Go','256 Go','512 Go'],['Obsidienne','Porcelaine','Bleu Azur'],{'128 Go':1099,'256 Go':1179,'512 Go':1299}),
      m('pixel-8','Pixel 8','Google',['128 Go','256 Go'],['Obsidienne','Noisette','Rose'],{'128 Go':699,'256 Go':759}),
      m('pixel-8a','Pixel 8a','Google',['128 Go','256 Go'],['Obsidienne','Porcelaine','Bleu Azur','Vert'],{'128 Go':549,'256 Go':609}),
      m('pixel-7-pro','Pixel 7 Pro','Google',['128 Go','256 Go'],['Obsidienne','Neige','Noisette'],{'128 Go':649,'256 Go':749}),
      m('pixel-7','Pixel 7','Google',['128 Go','256 Go'],['Obsidienne','Neige','Citronnelle'],{'128 Go':479,'256 Go':559}),
      m('pixel-7a','Pixel 7a','Google',['128 Go'],['Charbon','Neige','Mer','Corail'],{'128 Go':379}),
      m('pixel-6-pro','Pixel 6 Pro','Google',['128 Go','256 Go'],['Noir orage','Blanc nuage','Or soleil'],{'128 Go':449,'256 Go':549}),
      m('pixel-6','Pixel 6','Google',['128 Go','256 Go'],['Noir orage','Vert sauge','Corail'],{'128 Go':349,'256 Go':449}),
    ],
  },
  {
    id: 'xiaomi', name: 'Xiaomi', logo: '',
    models: [
      m('xiaomi-15-ultra','Xiaomi 15 Ultra','Xiaomi',['256 Go','512 Go'],['Noir','Blanc','Argent'],{'256 Go':1499,'512 Go':1599}),
      m('xiaomi-15-pro','Xiaomi 15 Pro','Xiaomi',['256 Go','512 Go'],['Noir','Blanc','Vert'],{'256 Go':1199,'512 Go':1299}),
      m('xiaomi-15','Xiaomi 15','Xiaomi',['256 Go','512 Go'],['Noir','Blanc','Vert'],{'256 Go':999,'512 Go':1099}),
      m('xiaomi-14-ultra','Xiaomi 14 Ultra','Xiaomi',['256 Go','512 Go'],['Noir','Blanc'],{'256 Go':1499,'512 Go':1599}),
      m('xiaomi-14','Xiaomi 14','Xiaomi',['256 Go','512 Go'],['Noir','Blanc','Vert'],{'256 Go':999,'512 Go':1099}),
      m('xiaomi-13t-pro','Xiaomi 13T Pro','Xiaomi',['256 Go','512 Go'],['Noir','Bleu','Vert'],{'256 Go':649,'512 Go':749}),
      m('xiaomi-13t','Xiaomi 13T','Xiaomi',['256 Go'],['Noir','Bleu','Vert'],{'256 Go':499}),
      m('redmi-note-14-pro-plus','Redmi Note 14 Pro+','Xiaomi',['128 Go','256 Go','512 Go'],['Noir','Bleu','Violet'],{'128 Go':399,'256 Go':449,'512 Go':529}),
      m('redmi-note-14-pro','Redmi Note 14 Pro','Xiaomi',['128 Go','256 Go'],['Noir','Bleu','Violet'],{'128 Go':329,'256 Go':389}),
      m('redmi-note-13-pro-plus','Redmi Note 13 Pro+','Xiaomi',['256 Go','512 Go'],['Noir','Bleu','Violet'],{'256 Go':449,'512 Go':499}),
      m('redmi-note-13-pro','Redmi Note 13 Pro','Xiaomi',['128 Go','256 Go'],['Noir','Bleu','Violet'],{'128 Go':299,'256 Go':349}),
      m('poco-f6-pro','POCO F6 Pro','Xiaomi',['256 Go','512 Go'],['Noir','Blanc'],{'256 Go':499,'512 Go':599}),
      m('poco-f6','POCO F6','Xiaomi',['256 Go','512 Go'],['Noir','Vert','Titane'],{'256 Go':399,'512 Go':479}),
      m('poco-x6-pro','POCO X6 Pro','Xiaomi',['256 Go','512 Go'],['Noir','Bleu','Jaune'],{'256 Go':349,'512 Go':399}),
    ],
  },
  {
    id: 'huawei', name: 'Huawei', logo: '',
    models: [
      m('huawei-pura-70-ultra','Pura 70 Ultra','Huawei',['256 Go','512 Go'],['Noir','Vert','Marron'],{'256 Go':1499,'512 Go':1649}),
      m('huawei-pura-70-pro','Pura 70 Pro','Huawei',['256 Go','512 Go'],['Noir','Vert','Violet'],{'256 Go':1099,'512 Go':1249}),
      m('huawei-pura-70','Pura 70','Huawei',['256 Go','512 Go'],['Noir','Vert','Violet'],{'256 Go':799,'512 Go':899}),
      m('huawei-mate-60-pro','Mate 60 Pro','Huawei',['256 Go','512 Go'],['Noir','Blanc','Vert'],{'256 Go':999,'512 Go':1099}),
      m('huawei-p60-pro','P60 Pro','Huawei',['256 Go','512 Go'],['Noir','Vert','Perle'],{'256 Go':849,'512 Go':949}),
      m('huawei-nova-12','Nova 12','Huawei',['256 Go'],['Noir','Blanc','Vert'],{'256 Go':449}),
    ],
  },
  {
    id: 'oneplus', name: 'OnePlus', logo: '',
    models: [
      m('oneplus-13','OnePlus 13','OnePlus',['256 Go','512 Go'],['Noir','Bleu','Blanc'],{'256 Go':999,'512 Go':1099}),
      m('oneplus-12','OnePlus 12','OnePlus',['256 Go','512 Go'],['Noir','Vert'],{'256 Go':899,'512 Go':999}),
      m('oneplus-12r','OnePlus 12R','OnePlus',['128 Go','256 Go'],['Gris fer','Bleu'],{'128 Go':549,'256 Go':649}),
      m('oneplus-nord-4','OnePlus Nord 4','OnePlus',['256 Go','512 Go'],['Argent','Noir'],{'256 Go':499,'512 Go':599}),
      m('oneplus-nord-3','OnePlus Nord 3','OnePlus',['128 Go','256 Go'],['Vert','Gris'],{'128 Go':449,'256 Go':499}),
      m('oneplus-nord-ce4-lite','OnePlus Nord CE 4 Lite','OnePlus',['128 Go','256 Go'],['Noir','Vert'],{'128 Go':299,'256 Go':349}),
    ],
  },
  {
    id: 'oppo', name: 'Oppo', logo: '',
    models: [
      m('oppo-find-x7-ultra','Find X7 Ultra','Oppo',['256 Go','512 Go'],['Noir','Bleu'],{'256 Go':1199,'512 Go':1349}),
      m('oppo-find-x6-pro','Find X6 Pro','Oppo',['256 Go'],['Noir','Vert'],{'256 Go':899}),
      m('oppo-reno-12-pro','Reno 12 Pro 5G','Oppo',['256 Go','512 Go'],['Gris','Noir','Rose'],{'256 Go':499,'512 Go':579}),
      m('oppo-reno-12','Reno 12 5G','Oppo',['256 Go'],['Noir','Rose','Bleu'],{'256 Go':399}),
      m('oppo-a80','A80 5G','Oppo',['128 Go','256 Go'],['Noir','Bleu'],{'128 Go':249,'256 Go':299}),
    ],
  },
  {
    id: 'honor', name: 'Honor', logo: '',
    models: [
      m('honor-magic6-pro','Magic6 Pro','Honor',['256 Go','512 Go'],['Noir','Vert','Violet'],{'256 Go':1099,'512 Go':1249}),
      m('honor-magic5-pro','Magic5 Pro','Honor',['256 Go','512 Go'],['Noir','Vert'],{'256 Go':899,'512 Go':1049}),
      m('honor-200-pro','Honor 200 Pro','Honor',['256 Go','512 Go'],['Noir','Bleu','Rose'],{'256 Go':699,'512 Go':799}),
      m('honor-200','Honor 200','Honor',['256 Go'],['Noir','Bleu','Vert'],{'256 Go':549}),
      m('honor-x8b','Honor X8b','Honor',['128 Go','256 Go'],['Noir','Bleu','Vert'],{'128 Go':249,'256 Go':299}),
    ],
  },
  {
    id: 'nothing', name: 'Nothing', logo: '',
    models: [
      m('nothing-phone-2a-plus','Phone (2a) Plus','Nothing',['256 Go'],['Noir','Gris'],{'256 Go':399}),
      m('nothing-phone-2a','Phone (2a)','Nothing',['128 Go','256 Go'],['Noir','Blanc'],{'128 Go':329,'256 Go':379}),
      m('nothing-phone-2','Phone (2)','Nothing',['128 Go','256 Go','512 Go'],['Blanc','Gris foncé'],{'128 Go':579,'256 Go':629,'512 Go':729}),
      m('nothing-phone-1','Phone (1)','Nothing',['128 Go','256 Go'],['Blanc','Noir'],{'128 Go':379,'256 Go':429}),
    ],
  },
  {
    id: 'sony', name: 'Sony', logo: '',
    models: [
      m('sony-xperia-1-vi','Xperia 1 VI','Sony',['256 Go','512 Go'],['Noir','Kaki','Argent'],{'256 Go':1399,'512 Go':1499}),
      m('sony-xperia-5-v','Xperia 5 V','Sony',['128 Go','256 Go'],['Noir','Bleu','Argent'],{'128 Go':899,'256 Go':999}),
      m('sony-xperia-10-vi','Xperia 10 VI','Sony',['128 Go'],['Noir','Blanc','Bleu'],{'128 Go':399}),
    ],
  },
  {
    id: 'motorola', name: 'Motorola', logo: '',
    models: [
      m('motorola-edge-50-ultra','Edge 50 Ultra','Motorola',['256 Go','512 Go'],['Noir','Bois','Bleu'],{'256 Go':899,'512 Go':999}),
      m('motorola-edge-50-pro','Edge 50 Pro','Motorola',['256 Go','512 Go'],['Noir','Beige','Bleu'],{'256 Go':599,'512 Go':699}),
      m('motorola-edge-50-fusion','Edge 50 Fusion','Motorola',['256 Go'],['Noir','Bleu','Rose'],{'256 Go':399}),
      m('motorola-razr-50-ultra','Razr 50 Ultra','Motorola',['256 Go','512 Go'],['Noir','Bleu','Pêche'],{'256 Go':1199,'512 Go':1299}),
      m('motorola-g85','Moto G85','Motorola',['128 Go','256 Go'],['Gris','Bleu','Violet'],{'128 Go':299,'256 Go':349}),
    ],
  },
  {
    id: 'autre', name: 'Autre Marque', logo: '',
    models: [
      m('autre-modele','Autre Modèle','Autre',['Toutes capacités'],['Standard'],{'Toutes capacités':0}),
    ],
  },
];

export function getBrand(brandId: string): Brand | undefined {
  return brands.find((b) => b.id === brandId);
}

export function getModel(brandId: string, modelId: string): PhoneModel | undefined {
  return getBrand(brandId)?.models.find((m) => m.id === modelId);
}
