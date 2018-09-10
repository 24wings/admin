export enum QueryAttributeType {
    Date = "Date",
    String = "String",
    Number = "Number",
    Boolean = "Boolean"
}
export class QueryAttribute {
    key: string;
    value: string;
    type: string;
    alias: string;
}
export class QueryParameter {
    queryConditions?: IQueryCondition[];
    pageParameter?: PageParameter;

}

export class QueryCondition {

    constructor(public field: string,
        public compare: string,
        public value: any,
        public andOr: "and" | "or") { }
}

export class PageParameter {
    constructor(
        public pageIndex: number = 0,
        public pageSize: number = 0,
        public sortField?: string,
        public sortByAsc?: true
    ) { }
}
export class QueryField {
    $in?: any[];
    /** 大于 */
    $gt?: number | string | Date;
    /** 小于 */
    $lt?: number | string | Date;
    /** :  前后统配 */
    $like?: string;
    /** l: 前通配*/
    $likeStart?: string;
    /** :l 后通配*/
    $likeEnd?: string;
    /** 不等于 */
    $notEq?: string | number;

}

export class QueryObject {
    [key: string]: string | number | QueryField;
    static toQueryContions = (queryObject: QueryObject): QueryCondition[] => {
        let conditions: QueryCondition[] = []
        for (let key in queryObject) {
            if (key != "toQueryParameter") {
                let value = queryObject[key];
                let type: string;
                if (typeof value == "string") {
                    type = "string"
                }
                if (typeof value == "number") {
                    type = "number"
                }
                if (Array.isArray(value)) {
                    throw new Error("不支持数组");
                }

                if (typeof value == "object") {
                    type = "object";
                }
                if (value instanceof Date) {
                    type = "date"
                }

                switch (type) {
                    case "string":
                    case "number":
                    case "date":
                        conditions.push(new QueryCondition(key, "=", value, "and"))
                        break;

                    default:
                        for (let op in value as QueryField) {
                            let field = value[op];
                            switch (op) {
                                case "$lt":
                                    conditions.push(new QueryCondition(key, "<", field, "and"))
                                    break;
                                case "$gt":
                                    conditions.push(new QueryCondition(key, ">", field, "and"));
                                    break;
                                case "$notEq":
                                    conditions.push(new QueryCondition(key, "!=", field, "and"));
                                    break;
                                case "$like":
                                    conditions.push(new QueryCondition(key, ":", field, "and"));
                                    break;
                                case "$likeStart":
                                    conditions.push(new QueryCondition(key, "l:", field, "and"));
                                    break;
                                case "$likeEnd":
                                    conditions.push(new QueryCondition(key, ":l", field, "and"));
                                    break;
                                default:
                                    break;
                            }

                        }
                        break;
                }
            }
        }
        return conditions;
    }
    /** or 并联查询 */
    static Or(queryObjects: QueryObject[]) {
        let conditions = []
        for (let obj of queryObjects) {
            let queryConditions = QueryObject.toQueryContions(Object.assign(obj, new QueryObject()));
            queryConditions[queryConditions.length - 1].andOr = "or"
            conditions.push(...queryConditions);
        }
        return conditions;
    }
}