import { z } from "zod";

const vector3 = z.tuple([z.number(), z.number(), z.number()]);
export const mbdModelSchema = z.object({
  version: z.literal(1),
  settings: z.object({ gravity: vector3, duration: z.number().positive(), stepSize: z.number().positive() }),
  bodies: z.array(z.object({ id: z.string(), name: z.string(), mass: z.number().positive(), position: vector3 })),
  joints: z.array(z.object({ id: z.string(), type: z.enum(["fixed", "revolute", "prismatic"]), bodyA: z.string(), bodyB: z.string() })),
  forces: z.array(z.object({ id: z.string(), type: z.enum(["gravity", "motor", "spring"]), targetId: z.string() })),
  outputs: z.array(z.object({ id: z.string(), type: z.enum(["position", "velocity", "force"]), targetId: z.string() }))
});
export type MbdModel = z.infer<typeof mbdModelSchema>;
export const validateModel = (model: unknown) => mbdModelSchema.safeParse(model);
export const createDemoModel = (): MbdModel => ({
  version: 1, settings: { gravity: [0, -9.81, 0], duration: 5, stepSize: 0.001 },
  bodies: [{ id: "ground", name: "Ground", mass: 1, position: [0, 0, 0] }, { id: "crank", name: "Crank", mass: 1, position: [0.2, 0, 0] }],
  joints: [{ id: "joint-1", type: "revolute", bodyA: "ground", bodyB: "crank" }],
  forces: [{ id: "motor-1", type: "motor", targetId: "joint-1" }], outputs: [{ id: "output-1", type: "position", targetId: "crank" }]
});
