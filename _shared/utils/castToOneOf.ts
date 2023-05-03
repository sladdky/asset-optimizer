// casting given value (i.e. string) to union of values(i.e. strings or null)
// usage: castToOneOf<'xx'|'yy'>(['xx','yy'], 'randomstring')
export function castToOneOf<T extends U, U>(coll: ReadonlyArray<T>, el: U): T | null {
	return coll.includes(el as T) ? (el as T) : null;
}

