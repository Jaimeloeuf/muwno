import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import type {
  ProductID,
  ReadOneTaskDTO,
  ReadManyTaskDTO,
  TaskID,
} from "@domain-model";

export class TaskController {
  static async getTask(taskID: TaskID) {
    const { res, err } = await sf
      .useDefault()
      .GET(`/task/${taskID}`)
      .useHeader(getAuthHeader)
      .runJSON<ReadOneTaskDTO>();

    if (err) throw err;
    if (!res.ok) throw new Error(`Failed to get Task: ${JSON.stringify(res)}`);

    return res.data.task;
  }

  static async updateTask(taskID: TaskID, task: string) {
    const { res, err } = await sf
      .useDefault()
      .PATCH(`/task/${taskID}`)
      .useHeader(getAuthHeader)
      .bodyJSON<{ task: string }>({ task })
      .runVoid();

    if (err) throw err;
    if (!res.ok)
      throw new Error(`Failed to update Task: ${JSON.stringify(res)}`);
  }

  static async getTasks(
    productID: ProductID,
    count: number,
    paginationID?: TaskID
  ) {
    const { res, err } = await sf
      .useDefault()
      .GET(`/task/of-product/${productID}`)
      .useQuery(
        paginationID !== undefined
          ? { count: count.toString(), paginationID }
          : { count: count.toString() }
      )
      .useHeader(getAuthHeader)
      .runJSON<ReadManyTaskDTO>();

    if (err) throw err;
    if (!res.ok) throw new Error(`Failed to get Tasks: ${JSON.stringify(res)}`);

    return res.data.tasks;
  }

  static async markTaskAsDone(taskID: TaskID) {
    const { res, err } = await sf
      .useDefault()
      .POST(`/task/done/${taskID}`)
      .useHeader(getAuthHeader)
      .runVoid((res) => res.json());

    if (err) throw err;
    if (!res.ok)
      throw new Error(`Failed to mark Task as done: ${JSON.stringify(res)}`);
  }
}
