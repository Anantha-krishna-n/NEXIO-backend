import { Whiteboard } from '../../entites/whiteboard'

export interface IWhiteboardRepository {
  create(whiteboardData: Partial<Whiteboard>): Promise<Whiteboard>;
  getByClassroomId(classroomId: string): Promise<Whiteboard | null>;
  update(classroomId: string, elements: any[]): Promise<Whiteboard | null>;
}
