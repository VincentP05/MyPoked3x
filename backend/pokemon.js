class Pokemon {
  constructor(id, name, weight, height, types, sprite, genus, entry) {
    this.id = id;
    this.name = name;
    this.weight = weight; // in Kg
    this.height = height; // in metres
    this.types = types;
    this.sprite = sprite;
    this.genus = genus;
    this.entry = entry;
  }

  getID() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  //Returns weight in lbs
  getWeight() {
    let pounds = this.weight * 2.205;
    let weight = Math.round(pounds * 10) / 10;
    return `${weight} lbs.`;
  }
  //Returns height in ft inches
  getHeight() {
    let original = this.height; //in metres
    let feet = Math.floor(original * 3.28084); //rounds down to the nearest foot
    let inches = (original * 3.28084 - feet) * 12; //takes the remainder of the foot and converts it to inches
    let inchesRounded = Math.round(inches);
    if (inchesRounded < 10) {
      let format = '0' + inchesRounded;
      return `${feet}'${format}"`;
    }
    return `${feet}'${inchesRounded}"`;
  }
  getTypes() {
    let typing = this.types;
    if (typing.length === 1) {
      let type1 = typing[0].type.name;
      return {
        type1,
      };
    } else {
      let type1 = typing[0].type.name;
      let type2 = typing[1].type.name;
      return {
        type1,
        type2,
      };
    }
  }
  getSprite() {
    return this.sprite;
  }
  getGenus() {
    return this.genus;
  }
  getEntry() {
    return this.entry;
  }
}

module.exports = Pokemon;
