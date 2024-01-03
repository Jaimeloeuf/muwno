import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import { prettyJSON } from "../utils";
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
    if (!res.ok) throw new Error(`Failed to get Task: ${prettyJSON(res)}`);

    return res.data.task;
  }

  static async updateTask(taskID: TaskID, task: string): Promise<Error | void> {
    const { res, err } = await sf
      .useDefault()
      .PATCH(`/task/${taskID}`)
      .useHeader(getAuthHeader)
      .bodyJSON<{ task: string }>({ task })
      .runVoid();

    if (err) return err;
    if (!res.ok) return new Error(`Failed to update Task: ${prettyJSON(res)}`);
  }

  static async deleteTask(taskID: TaskID): Promise<Error | void> {
    const { res, err } = await sf
      .useDefault()
      .DEL(`/task/${taskID}`)
      .useHeader(getAuthHeader)
      .runVoid();

    if (err) return err;
    if (!res.ok) return new Error(`Failed to delete Task: ${prettyJSON(res)}`);
  }

  static async getTasks(
    productID: ProductID,
    count: number,
    paginationID?: TaskID
  ) {
    const { res, err } = await sf
      .useDefault()
      .GET(`/task/of-product/${productID}`)
      .useQuery({ count: count.toString(), paginationID })
      .useHeader(getAuthHeader)
      .runJSON<ReadManyTaskDTO>();

    if (err) throw err;
    if (!res.ok) throw new Error(`Failed to get Tasks: ${prettyJSON(res)}`);

    return res.data.tasks;
  }

  static async markTaskAsDone(taskID: TaskID): Promise<Error | void> {
    const { res, err } = await sf
      .useDefault()
      .POST(`/task/done/${taskID}`)
      .useHeader(getAuthHeader)
      .runVoid((res) => res.json());

    if (err) return err;
    if (!res.ok)
      return new Error(`Failed to mark Task as done: ${prettyJSON(res)}`);
  }
}
