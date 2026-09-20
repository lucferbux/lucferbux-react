import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { registerServiceWorker } from "@/registerServiceWorker";

/**
 * The reload guard is the part worth pinning down.
 *
 * A service worker fires `controllerchange` both when it first takes control
 * of a page and when a new build replaces an old one. Reloading on the first
 * would make every first visit flash; not reloading on the second is the bug
 * that left a phone showing a weeks-old build. Only the second should reload.
 */
function fakeContainer(controller: object | null) {
  const listeners: Record<string, Array<() => void>> = {};
  const update = vi.fn().mockResolvedValue(undefined);
  return {
    container: {
      controller,
      addEventListener: (type: string, fn: () => void) => {
        (listeners[type] ??= []).push(fn);
      },
      register: vi.fn().mockResolvedValue({ update }),
    } as unknown as ServiceWorkerContainer,
    update,
    fire: (type: string) => listeners[type]?.forEach((fn) => fn()),
  };
}

describe("registerServiceWorker", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("does not reload when the worker first takes control of an uncontrolled page", async () => {
    const { container, fire } = fakeContainer(null);
    const reload = vi.fn();

    registerServiceWorker({ container, reload });
    await vi.advanceTimersByTimeAsync(0);
    fire("controllerchange");

    expect(reload).not.toHaveBeenCalled();
  });

  it("reloads once when a new worker replaces the one already in control", async () => {
    const { container, fire } = fakeContainer({});
    const reload = vi.fn();

    registerServiceWorker({ container, reload });
    await vi.advanceTimersByTimeAsync(0);
    fire("controllerchange");
    fire("controllerchange");

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("registers with updateViaCache disabled so the check is not answered from cache", async () => {
    const { container } = fakeContainer(null);

    registerServiceWorker({ container, reload: vi.fn() });
    await vi.advanceTimersByTimeAsync(0);

    expect(container.register).toHaveBeenCalledWith("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  });

  it("checks for an update on load and again on the interval", async () => {
    const { container, update } = fakeContainer(null);

    registerServiceWorker({ container, reload: vi.fn(), intervalMs: 1000 });
    await vi.advanceTimersByTimeAsync(0);
    expect(update).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(3000);
    expect(update).toHaveBeenCalledTimes(4);
  });

  it("checks again when a backgrounded tab comes back", async () => {
    const { container, update } = fakeContainer(null);

    registerServiceWorker({ container, reload: vi.fn() });
    await vi.advanceTimersByTimeAsync(0);
    update.mockClear();

    document.dispatchEvent(new Event("visibilitychange"));

    expect(update).toHaveBeenCalledTimes(1);
  });

  it("does nothing at all where service workers are unavailable", () => {
    expect(() =>
      registerServiceWorker({ container: undefined, reload: vi.fn() })
    ).not.toThrow();
  });
});
