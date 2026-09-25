# @title Which exception?
# @difficulty 3
# @tags exceptions, hierarchy
# @distractor TypeError\nKeyError
# @distractor ValueError\nLookupError
# @distractor ValueError\nIndexError
# @explain int("x") raises ValueError. A missing dict key raises KeyError, which is a subclass of LookupError, so the broader except clause catches it — but the object's own class name is still KeyError.
try:
    int("x")
except (ValueError, TypeError) as e:
    print(type(e).__name__)

try:
    {}["k"]
except LookupError as e:
    print(type(e).__name__)
