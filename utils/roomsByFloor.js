import { roomsByFloor as buildingARooms } from '~/utils/DCSTrooms'
import { roomsByFloor as buildingBRooms } from '~/utils/Libraryrooms'
import { roomsByFloor as buildingCRooms } from '~/utils/IHKrooms'

export const roomsByFloor = {
  // Merge floors from building A and B
  ...buildingARooms,
  ...buildingBRooms,
  ...buildingCRooms,
  // Add other floors if you want to merge or handle similarly
}
