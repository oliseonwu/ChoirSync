/**
 * Creates a Parse Pointer object
 * @param id - The id of the object to point to
 * @param className - The class name of the object to point to
 * @returns A Parse Pointer object
 */
function pointer(id: string, className: string) {
  return {
    __type: "Pointer",
    className,
    objectId: id,
  };
}

export { pointer };
