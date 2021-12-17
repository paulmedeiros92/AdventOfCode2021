const { txtToLineArray } = require('../ingest/lineByLine');

class PacketHeader {
  binaryConsumed = 6;
  constructor(binaryString) {
    this.version = parseInt(binaryString.substring(0, 3), 2);
    this.packetType = parseInt(binaryString.substring(3, 6), 2);
  }
}

class PacketBodyLiteral {
  constructor(tail) {
    let literal = '';
    let count = 0;
    for (let i=0; i < 5; i++) {
      count++;
      literal += tail.substring(1 + 5*i, 5 + 5*i);
      if (tail[0 + 5 * i] === '0') {
        break;
      }
    }
    this.literal = parseInt(literal, 2)
    this.binaryConsumed = 5 * count;
  }
}

class PacketBodyOperator {
  constructor(tail) {
    this.lengthType = parseInt(tail[0], 10);
    this.childLength = parseInt(this.lengthType === 0 ? tail.substring(1, 16) : tail.substring(1, 12), 2);
    this.binaryConsumed = this.lengthType === 0 ? 16 : 12;
  }
}

class Packet {
  constructor(binary) {
    this.header = new PacketHeader(binary);
    this.body = this.header.packetType === 4 ?
      new PacketBodyLiteral(binary.substring(this.header.binaryConsumed))
      : new PacketBodyOperator(binary.substring(this.header.binaryConsumed));
    this.length = 6 + this.body.binaryConsumed;
  }
}

function parseBinary(binary) {
  let packets = [];
  while(binary.length > 10) {
    const packet = new Packet(binary);
    packets.push(packet);
    binary = binary.substring(packet.length);

    if (packet.header.packetType !== 4) {
      const childLength = packet.body.childLength;
      if (packet.body.lengthType === 0) {
        const childBinary = binary.substring(0, childLength);
        packets = packets.concat(parseBinary(childBinary));
        binary = binary.substring(childLength);
      } else {
        for (let i = 0; i < childLength; i++) {
          packets = packets.concat(parseBinary(binary));
          binary = binary.substring(packets.reduce((prev, packet) => prev + packet.length, 0));
        }
      }
    }
  }
  return packets;
}

const lines = txtToLineArray('./day16/input.txt');
const binary = lines[0].split('').reduce((prev, char) => prev + parseInt(char, 16).toString(2).padStart(4, '0'), '');
const packets = parseBinary("10010011001100111011001101010101100000000010010100101001001011111100001101111111111001101111101001011001001011101111");
const bodies = packets.map((packet) => packet.body).filter((body) => body.lengthType === 1).sort((a,b) => b.childLength -a.childLength);
console.log(packets.reduce((prev, packet) => prev + packet.header.version, 0));
// 889/885 too damn high T___T