import type { Database } from 'sql.js';

export function bodyToFile(body: string) {
  const blob = new Blob([body], { type: 'text/plain' });
  const file = new File([blob], 'savegame.sav', { type: 'text/plain' });
  return file;
}
export async function readSavegame(file: File) {
  const initSqlJs = window.initSqlJs;
  const rawdb = await extractDatabase(file);
  const SQL = await initSqlJs({
    // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    // You can omit locateFile completely when running in node
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  const db = await new SQL.Database(rawdb);
  const player = extractPlayer(db);
  return player;
}

const MAGIC = new Uint8Array([0x47, 0x56, 0x41, 0x53]); // GVAS
const DB_START = new Uint8Array([
  0x52, 0x61, 0x77, 0x44, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x65, 0x49, 0x6d,
  0x61, 0x67, 0x65,
]); // RawDatabaseImage

export async function extractDatabase(file: File) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);

  // Check magic
  const magic = new Uint8Array(buffer, 0, 4);
  if (magic.toString() !== MAGIC.toString()) {
    throw new Error('Invalid file');
  }

  // Find pointer to the "RawDatabaseImage" property
  const dbImageStart = aob(buffer, DB_START);
  if (dbImageStart === -1) {
    throw new Error('Invalid file');
  }

  const sizePtr = dbImageStart + 61; // There's 61 bytes of metadata before the size (including the name of the property)
  const offsetPtr = sizePtr + 4; // Size is 4 bytes long

  const size = view.getUint32(sizePtr, true);

  // Extract the raw data from the file
  return new Uint8Array(buffer, offsetPtr, size);
}

// Simple AOB implementaiton for ArrayBuffer
// (Search for binary pattern inside bigger binary array)
function aob(buffer: ArrayBuffer, search: Uint8Array) {
  const arr = new Uint8Array(buffer);
  const len = arr.length;
  const searchLen = search.length;
  let i = 0;
  while (i < len) {
    let j = 0;
    while (j < searchLen && arr[i + j] === search[j]) {
      j++;
    }
    if (j === searchLen) {
      return i;
    }
    i++;
  }
  return -1;
}

export function extractPlayer(db: Database): SavefilePlayer {
  const playerSelect = db.exec(
    `SELECT DataValue FROM MiscDataDynamic WHERE DataOwner = 'Player' AND DataName IN ('HouseID', 'LocX', 'LocY', 'LocZ', 'Pitch', 'PlayerFirstName', 'PlayerLastName', 'Roll', 'World', 'Yaw', 'Year');`,
  );
  const { values } = playerSelect[0];
  const player = {
    houseId: values[0].toString(),
    position: {
      x: +values[1],
      y: +values[2],
      z: +values[3],
      pitch: +values[4],
      roll: +values[7],
      yaw: +values[9],
      world: values[8].toString(),
    },
    firstName: values[5].toString(),
    lastName: values[6].toString(),
    year: +values[10],
  };

  return player;
}

export type SavefilePlayer = {
  houseId: string;
  position: {
    x: number;
    y: number;
    z: number;
    pitch: number;
    roll: number;
    yaw: number;
    world: string;
  };
  firstName: string;
  lastName: string;
  year: number;
};
